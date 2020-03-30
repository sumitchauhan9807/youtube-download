const express = require('express');
const router = express.Router();
const path = require('path');
const musicController = require('../controllers/musicController');
const userMiddleware = require('../middleware/user');

 
router.get('/',userMiddleware.userData,(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../",'/index.html'));
})
var x=true
router.get('/convert',(req,res,next)=>{
    var n1 = "ganam";
    var n2 = "Avril_Lavigne_-_Wish_You_Were_Here_(Official_Music_Video)";
    if(x){
        var z = n1
        x=false
    }else{
        var z = n2
        x=true
    }
     musicController.convertfile('Dire_Straits_-_Tunnel_Of_Love').then(()=>{
            console.log('complete')
        }).catch(()=>{
    
        })
    
    
    res.send('asdasd');
})

router.post('/music',userMiddleware.userData,(req,res,next)=>{
    var userData = req.userData;
    var videoId = req.body.videoId;
    var artistId = req.body.artistId;
    console.log(videoId,artistId)
    musicController.downloadSong(userData,videoId,artistId)
    // .then((result)=>{
    //     res.send(result)
    // })
    res.send('sdfsdfsdf')
    
})

router.get('/artists',userMiddleware.userData,(req,res,next)=>{
    var userData = req.userData;
    musicController.getUserArtists(userData).then((result)=>{
        res.send(result);
    })
})

router.get('/search/:searchtext',userMiddleware.userData,(req,res,next)=>{
    let searchText = req.params.searchtext;
    console.log(searchText)
    musicController.searchResults(searchText,req.userData).then((searchResults)=>{
        res.send(searchResults)
    });
})


router.get('/getmysongs',userMiddleware.userData,(req,res,next)=>{
    let userid  = req.userData._id
    musicController.getUserSongs(userid).then((result)=>{
        res.download(result);
    })
})

router.get('/makezip',userMiddleware.userData,(req,res,next)=>{
    let userid  = req.userData._id
    musicController.makeMyZip(userid);
    res.send('making zippp');
})
router.get('/filedata',(req,res,next)=>{
    const fs =  require('fs')
    const path = require('path')
    var filePath = path.join(__dirname,"../",'media/video/ganam.mp4') 
     const src = fs.createReadStream(filePath);
    src.pipe(res);
    src.on('data', (chunk) => {
        console.log('asdasd')
      });
      
      src.on('end', () => {
        console.log('ended')
      });
})

module.exports = router;