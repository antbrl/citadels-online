import { Server } from 'socket.io';
import InMemoryGameStore from '../gameManager/InMemoryGameStore';
import Player from '../game/Player';
import Room from '../gameManager/Room';
import { genPlayerId, genRoomId } from '../utils/idGenerator';
import ExtendedSocket from './ExtendedSocket';
import GameSetupData from '../game/GameSetupData';

const gameStore = new InMemoryGameStore();

export function initSocket(io: Server) {
  io.on('connection', (socket: ExtendedSocket) => {
    console.log(`user '${socket.id}' connected`);

    socket.on('disconnect', () => {
      console.log(`user '${socket.id}' disconnected`);

      // emit a message to all players in room to remove this player
      if (socket.roomId && socket.playerId) {
        const room = gameStore.findRoom(socket.roomId);
        if (room) {
          const player = room.gameState.getPlayer(socket.playerId);
          if (player) player.online = false;
          socket.to(socket.roomId).emit('left room', socket.playerId);
        }
      }
    });

    socket.on('create room', (callback) => {
      // create new available room ID
      let roomId;
      do {
        roomId = genRoomId();
      } while (gameStore.hasRoom(roomId));
      socket.roomId = roomId;

      // create room
      const room = new Room(socket.roomId, io);
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

    socket.on('join room', (roomId: string, playerId: string, username: string, callback) => {
      // get room info
      const room = gameStore.findRoom(roomId);
      let player: Player | undefined;

      if (room) {
        // get player or create one if necessary
        if (room.gameState.containsPlayer(playerId)) {
          socket.playerId = playerId;
          player = room.gameState.getPlayer(socket.playerId);
          if (player) {
            player.online = true;
          } else {
            // player id is invalid
            callback(null);
            return;
          }
        } else {
          socket.playerId = genPlayerId();
          player = room.gameState.addPlayer(
            // player id
            socket.playerId,
            // username
            username || `Player ${socket.playerId}`,
            // first player gets to be the manager
            room.gameState.players.size === 0,
          );
          socket.to(roomId).emit('add player', player);
          console.log('added player', player);
        }

        // join room
        socket.roomId = roomId;
        socket.join(socket.roomId);

        // notify that the new player joined the room
        socket.to(socket.roomId).emit('joined room', socket.playerId);

        // return game state to joining player
        callback(room.gameState.getStateFromPlayer(socket.playerId));
        return;
      }
      // room id is invalid
      callback(null);
    });

    socket.on('start game', (serializedGameSetupData, callback) => {
      // room must exist
      const room = gameStore.findRoom(socket.roomId);
      if (!room) {
        callback({ status: 'error', message: 'room id is invalid' });
        return;
      }

      // player must exist
      const player = room.gameState.getPlayer(socket.playerId);
      if (!player) {
        callback({ status: 'error', message: 'player id is invalid' });
        return;
      }

      // player must be manager
      if (!player.manager) {
        callback({ status: 'error', message: 'you must be a manager' });
        return;
      }

      // construct setup data
      const gameSetupData = GameSetupData.fromJSON(serializedGameSetupData);

      // check setup data
      if (!room.gameState.validateGameSetup(gameSetupData)) {
        callback({ status: 'error', message: 'setup data is invalid' });
        return;
      }

      // update game state
      room.gameState.setupGame(gameSetupData);
      console.log(`game in room ${room.roomId} has been set up`);

      // start game
      if (room.gameState.step()) {
        room.update();
      }

      // tell the client that the request succeeded
      callback({ status: 'ok' });
    });
  });
}

export default { initSocket };
