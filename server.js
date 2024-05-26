const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {joinUser,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')


// acesss static files from public folder
app.use(express.static(path.join(__dirname,'public')))
const server = http.createServer(app) //creating server
const io = socketio(server)
const PORT = 3000 | process.env.PORT
const botname = 'ChatBot'

// Run when client connects
io.on('connection',(socket)=>{
    socket.on('joinRoom',({username, room})=>{
        const user = joinUser(socket.id,username, room)
        socket.join(user.room) //Join user to particular room
        socket.emit('message',formatMessage(botname,'Welcome to Chat Room')) // Welcome the user
        // Broadcast when user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined the chat`))
        // send user names present in the room
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })
  
    // catch the message from client
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
    // User Disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
    })
})
server.listen(PORT,()=>{
    console.log('Server Start running at ', PORT)
})