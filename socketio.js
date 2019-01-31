var fs = require('fs')
//https的一些設定
var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/awiclass.monoame.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/awiclass.monoame.com/fullchain.pem')
}

//https & socket port
var https = require('https').createServer(options);
https.listen(4040)
var io = require('socket.io')(https);

console.log("Server socket 4040 , api 4000")

//api port
var app = require('express')();
var port = 4000;
app.listen(port, function(){
  console.log('API listening on *:' + port);
});


var messages = [];

//用api方式取得
app.get('/api/messages',function(req,res){
  res.send(messages);
})

io.on('connection', function(socket){
  //初始化...
  console.log("A user connected.");
  io.emit("allMessage",messages);

  socket.on('sendMessage',function(obj){
    //get all message!
    messages.push(obj);
    console.log( obj.message + " - " + obj.name )
    io.emit('newMessage', obj);
  })

  socket.on('mousemove',function(obj){
    //get all message!
    //messages.push(obj);
    //console.log( obj.message + " - " + obj.name )
    io.emit('mousemove', obj);
  })
})
