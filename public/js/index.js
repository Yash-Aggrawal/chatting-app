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
while (named === null || named === undefined || named.length() === 0) {
    named = prompt("Enter your name to join");
}
socket.emit('new-user-joined', named);


socket.on('user-joined', name => {
    if (name !== null && name !== undefined) {
        append(`${name} joined the chat`, 'right');
    }
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})
socket.on('left', data => {
    if (data !== null && data !== undefined) {
        append(`${data} left the chat`, 'left')
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';

})