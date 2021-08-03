import { GameSetupData as SerializedGameSetupData, PlayerId } from 'citadels-common';

export default class GameSetupData {
  players: PlayerId[];
  completeCitySize: number;

  constructor(players: PlayerId[], completeCitySize: number) {
    this.players = players;
    this.completeCitySize = completeCitySize;
  }

  static fromJSON(obj: SerializedGameSetupData) {
    return new this(obj.players, obj.completeCitySize);
  }
}
