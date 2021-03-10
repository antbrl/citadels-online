const express = require('express');
const app = express()
const http = require('http').createServer(app);
const port = 8081

const io = require('socket.io')(http, { path: '/s/' });
const players = {};

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  const player = {
    id: socket.id,
    name: socket.username
  };
  console.log(`user '${player.name}' connected [${player.id}]`);

  // register player
  players[socket.id] = player;
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
    const player = players[socket.id];
    console.log(`user '${player.name}' disconnected [${player.id}]`);
    delete players[socket.id];

    // emit a message to all players to remove this player
    io.emit('disconnectPlayer', socket.id);
  });
});

http.listen(port, () => {
  console.log(`Citadels game server listening on http://localhost:${port}`);
});
