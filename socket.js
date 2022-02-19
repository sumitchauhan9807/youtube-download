const io = global.io;
exports.initSocketFunctions = (socket)=>{
    socket.on('init',(userId)=>{
        socket.join(userId);
        console.log('joined a rooom')
    })
    

    
}
