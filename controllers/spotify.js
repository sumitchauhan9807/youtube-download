const fetch = require('node-fetch');
const btoa = require('btoa');
const fs = require("fs");
var SpotifyWebApi = require('spotify-web-api-node');
const musicController = require("./musicController");
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
var ffmetadata = require("ffmetadata");

var clientId = 'a2aec960808a46a3890761f2af6406f1';
var clientSecret ='3a1bab5be2874035845325a0f1562471';
var app_access_token = 'BQDm-k39AQ77shUJk9aR_KaU_MDYIypU5GiBWoymSkf7RLVa5_ZyQ_9A5vt4rT4C1Ng8KBcet57NGsSIKwU';
var redirect_uri = 'http://localhost:5000/spotify/code';
console.log('THIS CODE IS RUNNING')
var user_auth_token_global = '';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri:redirect_uri
});

//AQAtDscxiazsVXwkKNGwhmYHUDqS0O1ysOuacWAD0a12SNWTdZN0IKGGZZZviHFEAb5APRiOHMrr4DYJsgTop8UF7zMxs_F5nLpXRLm_ImJErXZLWhUGpFXYUJGpXtLlPzR08n_mNyIFR-DIOCUySyKU5ThK6hJ6QrtwpHJDDJ9NBApQFWjXv6WZyzln5VYyTf3CwOYO2uKRtulynRvK_d5TWfpsklKoB5Y
//curl -X GET "https://api.spotify.com/v1/me" -H "Authorization: Bearer AQAtDscxiazsVXwkKNGwhmYHUDqS0O1ysOuacWAD0a12SNWTdZN0IKGGZZZviHFEAb5APRiOHMrr4DYJsgTop8UF7zMxs_F5nLpXRLm_ImJErXZLWhUGpFXYUJGpXtLlPzR08n_mNyIFR-DIOCUySyKU5ThK6hJ6QrtwpHJDDJ9NBApQFWjXv6WZyzln5VYyTf3CwOYO2uKRtulynRvK_d5TWfpsklKoB5Y"




String.prototype.cleanup = function() {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
}
const getTokenForApp = () =>{
  return new Promise((resolve,reject)=>{
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    }).then((response)=>{
        response.json().then((result)=>{
            //console.log(result);
            app_access_token  = result.access_token;
            resolve();
            //console.log(app_access_token)
            // getGeneres(accessToken);
        }).catch((error)=>{
          console.log(error);
        })
    })
  })
}


 function browse(){
   return new Promise((resolve,reject)=>{
        fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer ' + app_access_token}
      }).then((response)=>{
            response.json().then((data)=>{
              if(!data.error){
                //console.log(data);
                resolve(data);
              }else{
                getTokenForApp().then(()=>{
                  console.log('GENERATING NEW TOKEN');
                  browse();
                })
              }
            })
      })
   })
}



  function playlists(playlistId){
    return new Promise((resolve,reject)=>{
      fetch(`https://api.spotify.com/v1/browse/categories/${playlistId}/playlists`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + app_access_token}
    }).then((response)=>{
          response.json().then((data)=>{
              console.log(data);
              resolve(data);
          })
        })
    })
  }

  function tracks(playlistId){
    console.log('getting the tracks');
    return new Promise((resolve,reject)=>{
      fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + app_access_token}
    }).then((response)=>{
          response.json().then((data)=>{
              console.log(data);
              resolve(data);
          })
        }).catch((error)=>{
            console.log(error);
            resolve(data);
        })
    })
  }

  function searchSpotify(track){
    //https://api.spotify.com/v1/search?q=hallowed%20be%20thy%20name&type=track
    return new Promise((resolve,reject)=>{
      fetch(`https://api.spotify.com/v1/search?q=${track}&type=track`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + app_access_token}
    }).then((response)=>{
          response.json().then((data)=>{
            if(!data.error){
              //console.log(data);
              resolve(data);
            }else{
              getTokenForApp().then(()=>{
                console.log('GENERATING NEW TOKEN');
                resolve({
                  error:'call me later'
                })
              })
            }
          })
        }).catch((error)=>{
          getTokenForApp().then(()=>{
            console.log('GENERATING NEW TOKEN');
            resolve({
              error:'call me later'
            })
          })
            console.log(error);
            resolve(data);
        })
    })
  }


  function login(req,res){
    var scopes = 'user-read-private user-read-email user-library-read ugc-image-upload playlist-modify-public';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + clientId +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
  }


  function loginUser(res,user_auth_token){
    spotifyApi.authorizationCodeGrant(user_auth_token).then((data)=> {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);
     
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        res.redirect('http://localhost:3000/login/asdsadf345546')
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );
  }


  function getUserSavedTracks(){
    return new Promise((resolve,reject)=>{

      // spotifyApi.getMe()
      // .then(function(data) {
      //   resolve(data.body)
      // }, function(err) {
      //   reject(err)
      // });


      spotifyApi.getMySavedTracks({
        limit : 50,
        offset: 0
      })
      .then(function(data) {
        resolve(data);
        console.log('From get user liked tracks');
      }, function(err) {
        console.log('Something went wrong!', err);
        resolve(err);
      });
    })
  }


  function getYouTubeResults(songData){
      return new Promise((resolve,reject)=>{
        var artist = songData.artists.map((art)=>{
            return art.name
        });
        artist = artist.join(" ");
        var songName = songData.name;
        // console.log(artist,"asdasd");
        // console.log(songName,"name")
        var searchText =  artist + " "+ songName
        console.log(searchText,"===============")
        musicController.searchResults(searchText,"").then((searchResults)=>{
          resolve(searchResults);
        });

      })
  }
  function downloadSong(userData,videoId,trackMeta){
        // console.log(trackMeta,'VIDEO ID IS HERE');
        
        var artist = trackMeta.artists[0].name;
        var album = trackMeta.album.name;
        var thumb = trackMeta.album.images[0].url;
        var title = trackMeta.name;
        console.log(artist,album,thumb,title);
        var metaObject = {
          artist,
          album,
          thumb,
          title
        }
        // return 'asdasdasdasd';
        var url = 'http://www.youtube.com/watch?v='+videoId+''
        console.log(url);
        console.log(typeof url)
        var videoStream = ytdl(url);
        console.log(videoStream);

        videoStream.videoId = videoId;
        videoStream.pipe(fs.createWriteStream('./media/video/'+title.cleanup()+'.mp4'))
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
            convertToMp3(metaObject).then(()=>{
                var i = 0
               var int  =  setInterval(()=>{
                  if(i < 5){
                    console.log("emitting track dunlded ",i);
                    global.io.to(userData._id).emit('Track_Downloaded',{
                      videoId:videoId,
                      url:title.cleanup()
                    })
                  }else{
                    clearInterval(int)
                  }
                  i++;
                },1000)
                

                console.log('FILE DOWNLODED AND CONVERTED TO MP3 TOOOO') 
            }).catch(()=>{
                global.io.to(userData._id).emit('Error',true);
            })
        });
          
    }

function convertToMp3(metaObject){
      console.log('converting to mp3') 
      var title = metaObject.title;
      return new Promise((resolve,reject)=>{
      try{
          var process = new ffmpeg('./media/video/'+title.cleanup()+'.mp4');
          
      }catch(e){
          console.log(e)
         return reject();
      }
   
  // console.log('asdasdasdasdasdas-0098908908')
      process.then(function (video) {
          video.fnExtractSoundToMP3('./media/audio/'+title.cleanup()+'.mp3', function (error, file) {
              if (!error){
                  console.log('Audio file: ' + file);
                  var data = {
                      title:metaObject.title,
                      artist: metaObject.artist,
                      album:metaObject.album,
                      lyrics:'sumit is awesome'
                    };
                    var options = {
                      attachments: [metaObject.thumb],
                    };
                    ffmetadata.write('./media/audio/'+title.cleanup()+'.mp3', data,options, function(err) {
                        if (err) console.error("Error writing metadata", err);
                        else resolve(file);
                    });
                    // resolve(file);
                  
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

  function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  }




module.exports = {
  browse : browse,
  playlists:playlists,
  tracks:tracks,
  login:login,
  getUserSavedTracks:getUserSavedTracks,
  loginUser:loginUser,
  getYouTubeResults:getYouTubeResults,
  downloadSong:downloadSong,
  searchSpotify:searchSpotify
}