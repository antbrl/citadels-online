const idGenerator = require('./idGenerator.js');
const { Room, InMemoryGameStore } = require('./gameStore.js');

const gameStore = new InMemoryGameStore();

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`user '${socket.id}' connected`);

    socket.on('disconnect', () => {
      console.log(`user '${socket.id}' disconnected`);

      // emit a message to all players to remove this player
      if (socket.roomId && socket.userId) {
        socket.to(socket.roomId).broadcast('leave room', socket.userId);
      }
    });

    socket.on('create room', (callback) => {
      // create new available room ID
      let roomId;
      do {
        roomId = idGenerator.genRoomId();
      } while (gameStore.hasRoom(roomId));
      socket.roomId = roomId;

      // create room
      const room = new Room(socket.roomId);
      gameStore.saveRoom(room.roomId, room);

      // join room
      socket.join(socket.roomId);
      socket.emit('joined room', socket.roomId);

      console.log('created room', socket.roomId, room);
      callback(socket.roomId);
    });

    socket.on('get room info', (roomId, callback) => {
      // return room info
      const room = gameStore.findRoom(roomId);
      if (room) {
        callback(room.getRoomInfo());
      } else {
        callback({ status: 'not found' });
      }
    });

    socket.on('join room', (roomId, userId, username, callback) => {
      // get room info
      const room = gameStore.findRoom(roomId);

      if (room) {
          // get player or create one if necessary
          if (room.gameState.containsPlayer(userId)) {
            socket.userId = userId;
          } else {
            socket.userId = idGenerator.genUserId();
            room.gameState.addPlayer(socket.userId, username || `Player ${userId}`);
          }

          // join room
          socket.join(socket.roomId);

          // update game state to other players
          //socket.to(socket.roomId).broadcast('new player', socket.userId);

          // notify that the new player joined the room
          socket.broadcast.to(socket.roomId).emit('joined room', socket.userId);

          // return game state to joining player
          callback(room.gameState);

      } else {
          callback(null);
      }
    });
  });
}

module.exports = function(httpServer) {
  initSocket(httpServer);
};
