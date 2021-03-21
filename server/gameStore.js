const { GameState } = require('./gameState.js');

class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.gameState = new GameState();
  }
}

/* abstract */ class GameStore {
  findRoom(roomId) {}
  saveRoom(roomId, gameState) {}
  hasRoom(roomId) {}
  findAllRooms() {}
}

class InMemoryGameStore extends GameStore {
  constructor() {
    super();
    this.rooms = new Map();
  }

  findRoom(roomId) {
    return this.rooms.get(roomId);
  }

  saveRoom(roomId, gameState) {
    this.rooms.set(roomId, gameState);
  }

  hasRoom(roomId) {
    return this.rooms.has(roomId);
  }

  findAllRooms() {
    return [...this.rooms.values()];
  }
}

module.exports = {
  Room,
  InMemoryGameStore,
};
