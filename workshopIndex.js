var fs = require("fs")
var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/awiclass.monoame.com-0002/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/awiclass.monoame.com-0002/fullchain.pem')
}
var https = require('https').createServer(options)
https.listen(4041)
var io = require('socket.io')(https)

console.log("server socket 4041, api 4001");

var app = require("express")();
var port = 4001;
app.listen(port,function(){
  console.log("API listen on 4001")
})

var messages = [
  { name: "Majer", message: "HELLOOOOO"  }
]

var mousePos = {}
app.get('/',function(req,res){
//  res.send("hello");
  res.send(mousePos);
})
var typing= false
var timer = null
io.on('connection', function(socket){
  console.log("a user connected")
  socket.emit("allMessage",messages) 
  socket.on("message",function(obj){
    messages.push(obj)  
    console.log(obj.name+ "說:" + obj.message)
    io.emit("newMessage",obj)
  })
socket.on("hit",function(obj){
    io.emit("hit",obj)
    console.log("hit1")
  })

socket.on("hit2",function(obj){
    io.emit("hit2",obj)
    console.log("hit2")
  })
socket.on("osc",function(obj){
    io.emit("osc",obj)
    console.log("osc",obj)
  })
  socket.on("mouseMove",function(obj){
    console.log("mousemove",obj)
    io.emit("mouseMove",obj)
    mousePos = obj
  }) 
  socket.on("typing",function(){

    typing = true
    io.emit("typing",typing)
    clearTimeout(timer)
    timer= setTimeout(function(){
      typing=false
      io.emit("typing",typing)    
    },3000)


  })
})
