class Player {
  constructor(id, username, online) {
    this.id = id;
    this.username = username;
    this.online = online;
  }

  toString() {
    return `Player ${this.username}[${this.id}]`;
  }
}

class GameState {
  constructor() {
    this.players = new Map();
  }

  containsPlayer(playerId) {
    return this.players.has(playerId);
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  addPlayer(id, username, online = true) {
    const player = new Player(id, username, online);
    this.players.set(id, player);
    return player;
  }

  getStateFromPlayer(playerId) {
    return {
      players: Array.from(this.players),
      self: playerId,
    };
  }
}

module.exports = {
  Player,
  GameState,
};
