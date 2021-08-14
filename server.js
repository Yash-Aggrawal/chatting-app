// const PORT = process.env.PORT || 8000;

// const io = require('socket.io')(PORT, {
//     cors: {
//         origin: '*',
//     }
// });

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const users = {};


io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        console.log('new user joined', name);
        socket.broadcast.emit('user-joined', name);

    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });

    })
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));