const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const Artist = require('../models/artist');
const Track = require('../models/track');
var zip = require('file-zip');
//var videoId = "zUwEIt9ez7M";
var {google} = require('googleapis');
const ytsr = require('ytsr');
var ffmetadata = require("ffmetadata");
//https://github.com/sumitchauhan9807/slack.git
//git remote add origin git@github.com:sumitchauhan9807/youtube-download.git
//git remote add origin https://github.com/sumitchauhan9807/youtube-download.git

// git token -->   913c06f64e5a5b52fed4ff43d1103be7498a46af
exports.searchResults = (searchText,userData)=>{
    var return_result_array=[];
    //ssh -i "sumit.pem" ec2-user@ec2-52-66-243-150.ap-south-1.compute.amazonaws.com
    return new Promise((resolve,reject)=>{

        ytsr(searchText).then((searchResults)=>{
            console.log(searchResults)
            searchResults.items.forEach((thisVideo)=>{
            var obj = {};
            if(thisVideo.type == 'video'){
                obj.videoId = thisVideo.link.split("?v=")[1];
                obj.title = thisVideo.title;
                obj.duration = thisVideo.duration;
                obj.url = thisVideo.thumbnail
                return_result_array.push(obj)
            }
        })
        return resolve({
            results:return_result_array,
            next:searchResults.nextpageRef
        });
        }).catch((e)=>{
            console.log(e)
        })
        // ytsr(searchText, {}, function(error,searchResults){
        //     console.log(searchResults);
        //     searchResults.items.forEach((thisVideo)=>{
        //          var obj = {};
        //          if(thisVideo.type == 'video'){
        //              obj.videoId = thisVideo.link.split("?v=")[1];
        //              obj.title = thisVideo.title;
        //              obj.duration = thisVideo.duration;
        //              obj.url = thisVideo.thumbnail
        //              return_result_array.push(obj)
        //          }
        //     })
        //     return resolve({
        //      results:return_result_array,
        //      next:searchResults.nextpageRef
        //     });
        // });
        // let filter;
        // ytsr.getFilters(searchText, function(err, filters) {
        //     if(err) throw err;
        //    // console.log(filters,"THESE ARE THE FILTERS 1")
        //     filter = filters.get('Type').find(o => o.name === 'Video');
        //     ytsr.getFilters(filter.ref, function(err, filters) {
        //         if(err) throw err;
        //       //  console.log(filters,"THESE ARE THE FILTERS 2")
        //         filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
        //        // console.log(filter);
        //         var options = {
        //          limit: 30,
        //          nextpageRef: filter.ref,
        //         }
        //         console.log(filter.ref,'next page ref');
        //         ytsr(null, options, function(err, searchResults) {
        //         if(err) throw err;
        //            console.log(searchResults);
        //            searchResults.items.forEach((thisVideo)=>{
        //                 var obj = {};
        //                 if(thisVideo.link){
        //                     obj.videoId = thisVideo.link.split("?v=")[1];
        //                     obj.title = thisVideo.title;
        //                     obj.url = thisVideo.thumbnail
        //                     return_result_array.push(obj)
        //                 }
        //            })
        //            return resolve({
        //             results:return_result_array,
        //             next:searchResults.nextpageRef
        //            });
        //         });
        //     });
        // });


      })
    
}

exports.searchPagination = (searchText) =>{
    searchText = "https://www.youtube.com/"+searchText;
    var return_result_array = [];
    return new Promise((resolve,reject)=>{
        var options = {
            limit: 30,
            nextpageRef: searchText,
           }
           ytsr(null, options, function(err, searchResults) {
           if(err) throw err;
              console.log(searchResults);
              searchResults.items.forEach((thisVideo)=>{
                   var obj = {};
                   if(thisVideo.link){
                       obj.videoId = thisVideo.link.split("?v=")[1];
                       obj.title = thisVideo.title;
                       obj.url = thisVideo.thumbnail
                       return_result_array.push(obj)
                   }
              })
              return resolve({
               results:return_result_array,
               next:searchResults.nextpageRef
              });
           });
    })
}

exports.getUserArtists = (userData)=>{
    return new Promise((resolve,reject)=>{
        Artist.find({user:userData._id})
        .populate('tracks')
        .exec((err,result)=>{
            resolve(result)
        })
    })
}
function getVideoInfo(videoId){
    return new Promise((resolve,reject)=>{
        ytdl.getInfo('https://www.youtube.com/watch?v='+videoId+'').then((info)=>{
        console.log(info.player_response.streamingData.formats)
            resolve(info.player_response.streamingData.formats);
    })
    })
    
}
exports.downloadSong = (userData,videoId,artistId)=>{
//     console.log(userData)
//     return new Promise((resolve,reject)=>{
//         getVideoInfo(videoId).then((fromats)=>{
//             resolve(fromats)
//         });    
//     })
    
// return
    getVideoData(videoId).then((videoData)=>{
        String.prototype.cleanup = function() {
            return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
         }
         console.log(videoData.title)
        var title = videoData.title
        //console.log(title);
        title = title.cleanup();
        //return res.send(title);
        //title = title+'.mp4';
        
       // try{
            console.log(videoId,'VIDEO ID IS HERE')
            var url = 'http://www.youtube.com/watch?v='+videoId+''
          //  url = 'http://www.youtube.com/watch?v=A02s8omM_hI'
            console.log(url);
            console.log(typeof url)
            var videoStream = ytdl(url);
            console.log(videoStream);

            videoStream.videoId = videoId;
            videoStream.pipe(fs.createWriteStream('./media/video/'+title+'.mp4'))
            var dwnloadedBytes=0
            videoStream.on('data', (chunk) => {
                dwnloadedBytes = dwnloadedBytes + chunk.length
                console.log(`Downloaded  ${bytesToSize(dwnloadedBytes)}`);
                global.io.emit('Dowload_Percent',{
                    videoId:videoStream.videoId,
                    percent:bytesToSize(dwnloadedBytes)
                })
            });
            videoStream.on('end', () => {
                console.log('There will be no more data.');
                convertToMp3(title).then(()=>{
                    global.io.to(userData._id).emit('Track_Downloaded',{
                      //  artist_id:artistId,
                       // trackData:newTrack,
                        videoId:videoId,
                        url:title
                    })
                    console.log('FILE DOWNLODED AND CONVERTED TO MP3 TOOOO') 
                }).catch(()=>{
                    global.io.to(userData._id).emit('Error',true);
                })
            });
        // }catch(e){
        //     console.log('THERE IS AN ERROR HERE')
        //     console.log(e)
        // }
        
    })
}

function getVideoData(videoId){
    return new Promise((resolve,reject)=>{
        var url="https://www.youtube.com/watch?v="+videoId
        ytdl.getBasicInfo(url).then((result)=>{
            var videodata = result.player_response.videoDetails
            resolve(videodata)
            //var videoTitle  = videodata.title;
        })
    })
}
//ffmpeg -i input.mp3 -c copy -metadata artist="Someone" output.mp3
exports.convertfile = (title) =>{
    console.log('called')
    return new Promise((resolve,reject)=>{
        var process = new ffmpeg('./media/video/'+title+'.mp4');
        process.then(function (video) {
        video.fnExtractSoundToMP3('./media/audio/'+title+'.mp3', function (error, file) {
            if (!error){
                console.log('Audio file: ' + file);
                resolve(file);
            }
            if(error){
                console.log('sumit error',error)
            }
                
        });
        }, function (err) {
            console.log('Error: ' + err);
        });
    })
    
}
function convertToMp3(title){
    console.log('converting to mp3') 
    return new Promise((resolve,reject)=>{
    try{
        var process = new ffmpeg('./media/video/'+title+'.mp4');
        
    }catch(e){
        console.log(e)
       return reject();
    }
 
// console.log('asdasdasdasdasdas-0098908908')
    process.then(function (video) {
        video.fnExtractSoundToMP3('./media/audio/'+title+'.mp3', function (error, file) {
            if (!error){
                console.log('Audio file: ' + file);
                var data = {
                    artist: "sumit chauhan",
                  };
                  var options = {
                    attachments: ["./media/audio/test.jpg"],
                  };
                //   ffmetadata.write('./media/audio/'+title+'.mp3', data,options, function(err) {
                //       if (err) console.error("Error writing metadata", err);
                //       else resolve(file);
                //   });
                  resolve(file);
                
            }
            if(error){
                console.log('there was an error sumit')
                console.log(error)
                return reject();
            }
                
        });
        }, function (err) {
            console.log('Error is this sumit: ' + err);
           return reject();
        });

    }).catch((err)=>{
        console.log(err);
        return reject();
    });
}



exports.makeMyZip = (userid)=>{
    console.log('making zip');
    var zipFilesArray=[];
        Track.find({user:userid}).exec((err,results)=>{
        results.forEach((file)=>{
            var thisFilePath = path.join(__dirname,"../","media/audio/"+file.name+".mp3") 
            zipFilesArray.push(thisFilePath)
        })
        var outpath = path.join(__dirname,"../","media/zip/zipped.zip")
            zip.zipFile(zipFilesArray,outpath,function(err){
            if(err){
                console.log('zip error',err)
            }else{
                console.log('zip success');
                global.io.to(userid).emit('Zip_Complete',true);
                
            }
        })
    })
}
exports.getUserSongs = (userid)=>{

    return new Promise((resolve,reject)=>{
        var zipFilesArray=[];
        Track.find({user:userid}).exec((err,results)=>{
        results.forEach((file)=>{
            var thisFilePath = path.join(__dirname,"../","media/audio/"+file.name+".mp3") 
            zipFilesArray.push(thisFilePath)
        })
        var outpath = path.join(__dirname,"../","media/zip/zipped.zip")
            zip.zipFile(zipFilesArray,outpath,function(err){
            if(err){
                console.log('zip error',err)
            }else{
                console.log('zip success');
                resolve(outpath)
            }
        })
    })
        
    })
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }