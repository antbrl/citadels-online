const express = require('express');
const app = express()
const http = require('http').createServer(app);
const port = 8081

const io = require('socket.io')(http, { path: '/s/' });

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`Citadels game server listening on http://localhost:${port}`);
});
