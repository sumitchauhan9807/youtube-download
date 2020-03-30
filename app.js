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

app.get('/mongo',(req,res,next)=>{
    
    Artist.find({}).exec((err,result)=>{
        res.send(result);
    })
    // var artist = new Artist({
    //     name:'general',
    //     user:'5e7f6a307cf4011ac821649c'
    // })
    // artist.save().then((result)=>{
    //     res.send(result)
    // }).catch((err)=>{
    //     res.send(err)
    // })
})
    
var socketFunctions = require('./socket')

  var mongoConnect = mongoose.connect('mongodb://localhost:27017/musicWorld', {useNewUrlParser: true});
    mongoConnect.then(()=>{
        const server = require('http').createServer(app);
        global.io = require('socket.io')(server);
        global.io.on('connection', (socket) => {
            console.log('user connected')
            socketFunctions.initSocketFunctions(socket)
        });
        server.listen(3000); 
        console.log('listing to app')     
    })
