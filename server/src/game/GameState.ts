import Player from './Player';

export default class GameState {
  players: Map<string, Player>;

  constructor() {
    this.players = new Map();
  }

  containsPlayer(playerId: string) {
    return this.players.has(playerId);
  }

  getPlayer(playerId: string) {
    return this.players.get(playerId);
  }

  addPlayer(id: string, username: string, online = true) {
    const player = new Player(id, username, online);
    this.players.set(id, player);
    return player;
  }

  getStateFromPlayer(playerId: string) {
    return {
      players: Array.from(this.players),
      self: playerId,
    };
  }
}
