const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })

  socket.on('avatar-new-entered', (coordinates, roomId, userId) => {
    socket.to(roomId).broadcast.emit('avatar-starting-position', coordinates.x, coordinates.y, userId);
  })

  socket.on('avatar-update', (roomId, coordinates, userId) => {
    socket.to(roomId).broadcast.emit('remote-avatar-update', coordinates, userId);
  })  

})

server.listen(3100);