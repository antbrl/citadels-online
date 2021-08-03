import { Server } from 'socket.io';
import { GameProgress, RoomId } from 'citadels-common';
import GameState from '../game/GameState';
import ExtendedSocket from '../socket/ExtendedSocket';
import { Observer } from '../utils/observerPattern';

export default class Room implements Observer {
  roomId: RoomId;
  gameState: GameState;
  io: Server;

  constructor(roomId: RoomId, io: Server) {
    this.roomId = roomId;
    this.gameState = new GameState();
    this.io = io;

    this.gameState.attach(this);
  }

  getRoomInfo() {
    if (this.gameState.progress === GameProgress.IN_LOBBY) {
      return { status: 'open' };
    }
    return { status: 'closed' };
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
