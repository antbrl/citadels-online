export interface SerializedGameSetupData {
  players: string[]
}

export default class GameSetupData {
  players: string[];

  constructor(players: string[]) {
    this.players = players;
  }

  static fromJSON(obj: SerializedGameSetupData) {
    return new this(obj.players);
  }
}
