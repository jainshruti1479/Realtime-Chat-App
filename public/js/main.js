const roomName = document.getElementById('room-name');
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const usersLi = document.getElementById('users')

// Get username and room name from query params
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix : true
})

const socket = io()

// Join room
socket.emit('joinRoom',{username, room})

// Get User lists
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room)
  outputUsers(users)
})

// Message from server
socket.on('message',message=>{
  outputMessage(message)
  chatMessages.scrollTop = chatMessages.scrollHeight
})
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  const message = e.target.elements.msg.value
  // Emit message to server
  socket.emit('chatMessage',message)
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})
function outputMessage(msg){
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${msg.user} <span>${msg.time}</span></p>
  <p class="text">${msg.msg}</p>`
  document.querySelector('.chat-messages').appendChild(div)
}
function outputRoomName(room){
  roomName.innerText = room
}
function outputUsers(users){
  usersLi.innerHTML= `${users.map(user=>`<li>${user.username}</li>`).join('')}`
}