import GameState from './GameState';

export default class Room {
  roomId: string;

  gameState: GameState;

  status: string;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.gameState = new GameState();
    this.status = 'open';
  }

  getRoomInfo() {
    return { status: this.status };
  }
}
