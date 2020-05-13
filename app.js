const express = require("express");
const app = express();
app.use('/media',express.static('media'))
// /http://localhost:3000/media/audio/Iron_Maiden.mp3
const userRouter = require('./routes/user');
const request = require('request'); 
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require('ffmpeg');
const User = require('./models/user');
const Artist = require('./models/artist');
const Track = require('./models/track'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/user',userRouter);

//git remote add origin https://github.com/sumitchauhan9807/youtube-download.git
app.get('/vinit',(req,res,nxt)=>{
    res.send('hi i am vinit')
})
app.get('/mongo',(req,res,next)=>{
   
    var user = new User({
        name : "Sumit",
        email:"123@gmail.com"
    })

    user.save().then((result)=>{
        res.send(result)
    })
})
    
var socketFunctions = require('./socket')

 // var mongoConnect = mongoose.connect('mongodb://localhost:27017/musicWorld', {useNewUrlParser: true});
   //  mongoConnect.then(()=>{
        const server = require('http').createServer(app);
        global.io = require('socket.io')(server);
        global.io.on('connection', (socket) => {
            console.log('user connected')
            socketFunctions.initSocketFunctions(socket)
        });
        server.listen(5000); 
        console.log('listing to app')     
   // })
    