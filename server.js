const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
// acesss static files from public folder
app.use(express.static(path.join(__dirname,'public')))
const server = http.createServer(app) //creating server
const io = socketio(server)
const PORT = 3000 | process.env.PORT
io.on('connection',(socket)=>{
    console.log('Connection Established')
    socket.emit('message','Welcome to Chat Room')
})
server.listen(PORT,()=>{
    console.log('Server Start running at ', PORT)
})