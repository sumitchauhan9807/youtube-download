const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const musicController = require('../controllers/musicController');
const suggestionCtr = require('../controllers/searchSuggestions');
const userMiddleware = require('../middleware/user');

 

router.get('/delete/:type',(req,res,next)=>{
    var type = req.params.type;
    console.log(type);
    if(type =='video'){
        var  directory = path.join(__dirname,"../","/media/video");
    }else if(type == "audio"){
        var  directory = path.join(__dirname,"../","/media/audio");
    }else{
        return res.send({
            message:'invalid request'
        })
    }
    
    console.log(directory);
    //return
    fs.readdir(directory, (err, files) => {
        if(!files.length){
            return res.send({
                message:'no files to delete'
            })
        }
        console.log(files.length);
        if (err) throw err;
        var fileCount=0;
        var filesNameArray = [];
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                 if (err) throw err;
                 filesNameArray.push(file)
                 fileCount++;
                 console.log('file deleted')
                 if(fileCount == files.length){
                     res.send({
                         files:filesNameArray,
                         length:filesNameArray.length
                     })
                 }
            });
        }
    });
})
router.get('/',(req,res,next)=>{
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

router.post('/music',(req,res,next)=>{
    var userData = {
        _id:"5e821c86d99be04a67062704"
    }
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

router.get('/search/:searchtext',(req,res,next)=>{
    let searchText = req.params.searchtext;
    console.log(searchText)
    musicController.searchResults(searchText,req.userData).then((searchResults)=>{
        res.send(searchResults)
    });
})

router.get('/suggestions/:searchtext',(req,res,next)=>{
    let searchText = req.params.searchtext;
    console.log(searchText)
    suggestionCtr.getSearchSuggestions(searchText).then((searchResults)=>{
        res.send(searchResults)
    });
})

router.post("/searchpagination",(req,res)=>{
    console.log(req.body.next,'next');
    console.log(req.body)
    musicController.searchPagination(req.body.next).then((searchResults)=>{
        res.send(searchResults)
    })
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