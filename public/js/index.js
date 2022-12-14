const socket = io();
// const socket = io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const container = document.querySelector('.container');

var audio = new Audio('ting.mp3');

const append = (message, position) => {

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    container.append(messageElement);
    if (position == 'left') {
        audio.play();
    }


}

const named = prompt("Enter your name to join");
socket.emit('new-user-joined', named);


socket.on('user-joined', name => {
    name.trim();
    if (!name) {
        name = 'Unnamed Person'
    }
    append(`${name} joined the chat`, 'right');
})

socket.on('receive', data => {
    data.name.trim();
    if (!data.name) {
        data.name = 'Unnamed Person'
    }
    append(`${data.name}: ${data.message}`, 'left')
})
socket.on('left', data => {
    data.trim();
    if (!data) {
        data = 'Unnamed Person'

    }
    append(`${data} left the chat`, 'left')
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';

})