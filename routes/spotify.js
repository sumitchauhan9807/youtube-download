const express = require('express');
const spotifyController = require('../controllers/spotify');
const router = express.Router();

router.get('/browse',(req,res,next)=>{
  spotifyController.browse().then((data)=>{
    res.send(data)
  })
})

router.get('/playlists/:id',(req,res,next)=>{
    let playlistId = req.params.id;
    spotifyController.playlists(playlistId).then((data)=>{
        res.send(data);
    })
})

router.get('/tracks/:id',(req,res,next)=>{
    let playlistId = req.params.id;
    spotifyController.tracks(playlistId).then((data)=>{
      res.send(data);
    })
})


router.get('/login',(req,res,next)=>{
  spotifyController.login(req,res)
})
router.get('/code',(req,res,next)=>{
  spotifyController.loginUser(res,req.query.code)
})

router.get('/liked',(req,res,next)=>{
  spotifyController.getUserSavedTracks().then((data)=>{
    res.send(data);
  }).catch((err)=>{
      res.send(err);
  });
})

router.post('/track',(req,res,next)=>{
    spotifyController.getYouTubeResults(req.body.data).then((data)=>{
      res.status(200);
      res.json(data)
    })
})

router.post('/search',(req,res,next)=>{
  spotifyController.searchSpotify(req.body.track).then((data)=>{
    res.send(data)
  })
})

router.post('/download',(req,res,next)=>{
  var userData = {
      _id:"5e821c86d99be04a67062704"
  }
  var videoId = req.body.videoId;
  var trackMeta = req.body.trackMeta;

  
  
  spotifyController.downloadSong(userData,videoId,trackMeta)
  
  res.send('download song')
  
})


module.exports = router;