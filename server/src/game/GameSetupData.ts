import { GameSetupData as SerializedGameSetupData } from 'citadels-common';

export default class GameSetupData {
  players: string[];
  completeCitySize: number;

  constructor(players: string[], completeCitySize: number) {
    this.players = players;
    this.completeCitySize = completeCitySize;
  }

  static fromJSON(obj: SerializedGameSetupData) {
    return new this(obj.players, obj.completeCitySize);
  }
}
