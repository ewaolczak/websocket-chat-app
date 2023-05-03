const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket, userName) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', (userName) => {
    users.push({ id: socket.id, name: userName });
    console.log(socket.id + ' has chosen the name: ' + userName);
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `<i>${userName} has joined the conversation!</i>`
    });
  });
  // socket.on('userJoined', (userName) => {
  // });
  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  console.log("I've added a listener on message and disconnect events \n");
  socket.on('disconnect', () => {
    if (users.length > 0) {
      const user = users.find((user) => user.id === socket.id);
      users.splice(users.indexOf(user), 1);
      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `<i>${user.name} has left the conversation... :(</i>`
      });
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});
