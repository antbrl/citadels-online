const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 8081;

const io = require('socket.io')(http, { path: '/s/' });
require('./server.js')(io);

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
});

http.listen(port, () => {
  console.log(`Citadels game server listening on http://localhost:${port}`);
});
