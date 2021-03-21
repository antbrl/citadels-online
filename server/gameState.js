class Player {
  constructor(userId, username) {
    this.userId = userId;
    this.username = username;
  }

  toString() {
    return `Player ${this.username}[${this.userId}]`;
  }
}

class GameState {
  constructor() {
    this.players = new Map();
  }

  containsPlayer(userId) {
    return this.players.has(userId);
  }

  getPlayer(userId) {
    return this.players.get(userId);
  }

  addPlayer(userId, username) {
    this.players.set(userId, new Player(userId, username))
  }
}

module.exports = {
  Player,
  GameState,
};
