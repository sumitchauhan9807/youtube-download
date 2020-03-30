const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const Artist = require('../models/artist');
const Track = require('../models/track');
var zip = require('file-zip');
//var videoId = "zUwEIt9ez7M";
var {google} = require('googleapis');
//https://github.com/sumitchauhan9807/slack.git

//git remote add origin https://github.com/sumitchauhan9807/youtube-download.git

//git remote set-url youtube https://github.com/sumitchauhan9807/youtube-download.git

//echo "
// [mongodb-org-3.0]
// name=MongoDB Repository
// baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.0/x86_64/
// gpgcheck=0
// enabled=1" > /

exports.searchResults = (searchText,userData)=>{
    //AIzaSyDlIyaKk59zXr4Htf08G6nD0yU5ih9twe4
    return new Promise((resolve,reject)=>{
        youtubeV3 = google.youtube( { version: 'v3', auth: 'AIzaSyDlIyaKk59zXr4Htf08G6nD0yU5ih9twe4' } );

        var request =  youtubeV3.search.list({
            part: 'snippet',
            type: 'video',
            q: searchText,
            maxResults: 50,
          //  order: 'date',
            safeSearch: 'moderate',
            videoEmbeddable: true
        }, (err,response) => {
            if(err){
                return reject(err)
            }

            var searchVideoData  = response.data.items;
            var searchVideoIds = searchVideoData.map((searchVideo)=>{
                return searchVideo.id.videoId
            })
            var query = {$and:[
                {user:userData._id},
                {videoId:{$in:searchVideoIds}}
            ]}
            Track.find(query).exec((err,result)=>{
                console.log(result);
                let foundVideosIdArray = result.map((foundVideo)=>{
                    return foundVideo.videoId
                })
                console.log(foundVideosIdArray)
                var returnData = searchVideoData.map((thisSearchedVideo)=>{
                    if(foundVideosIdArray.includes(thisSearchedVideo.id.videoId)){
                        console.log('found')
                        var thisVideoSavedData = result.find((foundData)=>{
                            return thisSearchedVideo.id.videoId == foundData.videoId
                        })
                        thisSearchedVideo.foundData =  true; 
                        thisSearchedVideo.url = thisVideoSavedData.name
                        return thisSearchedVideo
                    }else{
                        console.log('n-found')
                        thisSearchedVideo.foundData =  false;
                        return thisSearchedVideo
                    }
                    
                })
                resolve(returnData);
            })
            
           
            //console.log(err)
           // console.log(response.data.items);
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
        var title = videoData.title
        //console.log(title);
        title = "sumitRoxxx_"+title.replace(/\s/g,'_')
        .replace(/\|/g, ",")
        .replace(/\//g, ",")
        .replace(/[\[\]']+/g, '')
        .replace(/[\[\]']+/g, '')
        .substring(0, 18)
        console.log(title);
        //return res.send(title);
        //title = title+'.mp4';
        try{
            var videoStream = ytdl('https://www.youtube.com/watch?v='+videoId+'')
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
                var track = new Track({
                    user:userData._id,
                    name:title,
                    artist:artistId,
                    videoId:videoId
                })
                track.save().then((newTrack)=>{
                    //"$push": { "childrens": employee._id }
                    Artist.updateOne({_id:artistId},{
                        $push:{tracks:newTrack._id}
                    }).exec(()=>{
                        console.log('user track save successfully!!! ')
                        convertToMp3(title).then(()=>{
                            global.io.to(userData._id).emit('Track_Downloaded',{
                                artist_id:artistId,
                                trackData:newTrack,
                                videoId:videoId,
                                url:title
                            })
                            console.log('FILE DOWNLODED AND CONVERTED TO MP3 TOOOO') 
                        })
                    })
                    
                })
                
            });
        }catch(e){
            console.log(e)
        }
        
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
    }
 
// console.log('asdasdasdasdasdas-0098908908')
    process.then(function (video) {
        video.fnExtractSoundToMP3('./media/audio/'+title+'.mp3', function (error, file) {
            if (!error){
                console.log('Audio file: ' + file);
                resolve(file);
            }
            if(error){
                console.log('there was an error sumit')
                console.log(error)
            }
                
        });
        }, function (err) {
            console.log('Error is this sumit: ' + err);
        });

    }).catch((err)=>{
        console.log(err);
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
         // var zippath = path.join(__dirname,"../","media/zip/Fade_To_Black.mp3")
        // console.log(zippath)
    })
}











var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "./ffmpeg/bin/ffmpeg",        // Where is the FFmpeg binary located?
    "outputPath": "./music",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});


exports.downloadSongx = () =>{
    YD.download("9bZkp7q19f0");
    YD.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
    });
    YD.on("error", function(error) {
        console.log(error,'error occured');
    });
     
    YD.on("progress", function(progress) {
        console.log(JSON.stringify(progress));
    });
    
   return 'asdasd  downloading';     
}


function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }