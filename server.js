const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express()
const PORT = 8000;
const server = app.listen(PORT, () => {
    console.log('Server working on port:', PORT);
})
const io = socket(server);

const removeDisconnectedUser = (id) => {
    const userIndex = users.findIndex(user => user.userId === id);
    if (userIndex !== -1) {
        const [removedUser] = users.splice(userIndex, 1);
        console.log('User ' + removedUser.user + ' was removed from online users');
        console.log('current users:', users);
    } 
}

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('userLogin', ({userLogin}) => {
        console.log('User ' + userLogin + 'has loged in with id ' + socket.id)
        users.push({user: userLogin, userId: socket.id})
        console.log('current users:', users);
        socket.broadcast.emit('alert', {content: `${userLogin} joined the chat!`});
    });

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => { 
        console.log('Oh, socket ' + socket.id + 'has left')
        const disconnectedUser = users.find(user => user.userId === socket.id);
        removeDisconnectedUser(socket.id);
        socket.broadcast.emit('alert', {content: `${disconnectedUser.user} has left the chat... :(`});
    })
    console.log('I\'ve added a listener on message event \n');
  });

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});