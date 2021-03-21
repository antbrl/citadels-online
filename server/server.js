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

    socket.on('join room', (roomId, callback) => {
      if (roomId) {
        // find existing room
        const room = gameStore.findRoom(roomId);
        if (room) {
          socket.roomId = roomId;
          if (room.gameState.containsPlayer(userId)) {
            socket.userId = userId;
          } else {
            socket.userId = idGenerator.genUserId();
          }

          // join room
          socket.join(socket.roomId);
          //socket.to(socket.roomId).broadcast('new player', socket.userId);
          socket.to(socket.roomId).broadcast('joined room', socket.userId);
          callback(room);
        } else {
          callback(new Error('invalid room id'));
        }
      } else {
        callback(new Error('invalid room id'));
      }
    });
  });
}

module.exports = function(httpServer) {
  initSocket(httpServer);
};
