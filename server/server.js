const idGenerator = require('./idGenerator.js');
const { Room, InMemoryGameStore } = require('./gameStore.js');

const gameStore = new InMemoryGameStore();

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`user '${socket.id}' connected`);

    if (socket.roomId && socket.playerId) {
      const room = gameStore.findRoom(socket.roomId);
      if (room) {
        const player = room.gameState.getPlayer(socket.playerId)
        if (player) player.online = true;
        socket.to(socket.roomId).emit('joined room', socket.playerId);
      }
    }

    socket.on('disconnect', () => {
      console.log(`user '${socket.id}' disconnected`);

      // emit a message to all players in room to remove this player
      if (socket.roomId && socket.playerId) {
        const room = gameStore.findRoom(socket.roomId);
        if (room) {
          const player = room.gameState.getPlayer(socket.playerId)
          if (player) player.online = false;
          socket.to(socket.roomId).emit('left room', socket.playerId);
        }
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

    socket.on('join room', (roomId, playerId, username, callback) => {
      // get room info
      const room = gameStore.findRoom(roomId);
      let player;

      if (room) {
        // get player or create one if necessary
        if (room.gameState.containsPlayer(playerId)) {
          player = room.gameState.getPlayer(playerId)
        } else {
          playerId = idGenerator.genPlayerId();
          player = room.gameState.addPlayer(playerId, username || `Player ${playerId}`);
          socket.to(roomId).emit('add player', player);
          console.log('added player', player);
        }
        socket.playerId = playerId;

        // join room
        socket.roomId = roomId;
        socket.join(roomId);

        // notify that the new player joined the room
        socket.to(roomId).emit('joined room', playerId);

        // return game state to joining player
        callback(room.gameState.getStateFromPlayer(playerId));

      } else {
          callback(null);
      }
    });
  });
}

module.exports = function(httpServer) {
  initSocket(httpServer);
};
