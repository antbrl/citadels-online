import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './socket/server';

const app = express();
const http = createServer(app);
const port = process.env.PORT || 8081;

const io = new Server(http, { path: '/s/' });
initSocket(io);

app.use(express.static(`../client/dist`));

http.listen(port, () => {
  console.log(`Citadels game server listening on http://localhost:${port}`);
});
