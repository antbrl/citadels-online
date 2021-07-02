import { Server } from 'socket.io';
import GameState from '../game/GameState';
import ExtendedSocket from '../socket/ExtendedSocket';
import { Observer } from '../utils/observerPattern';

export default class Room implements Observer {
  roomId: string;
  gameState: GameState;
  status: string;
  io: Server;

  constructor(roomId: string, io: Server) {
    this.roomId = roomId;
    this.gameState = new GameState();
    this.status = 'open';
    this.io = io;

    this.gameState.attach(this);
  }

  getRoomInfo() {
    return { status: this.status };
  }

  update(): void {
    this.sendRoomStateToAllClients();
  }

  sendRoomStateToAllClients() {
    const clients = this.io.sockets.adapter.rooms.get(this.roomId);
    if (clients) {
      clients.forEach((clientId) => {
        const clientSocket: ExtendedSocket | undefined = this.io.sockets.sockets.get(clientId);
        if (clientSocket) {
          clientSocket.emit('update game state', this.gameState.getStateFromPlayer(clientSocket.playerId));
        }
      });
    }
  }
}
