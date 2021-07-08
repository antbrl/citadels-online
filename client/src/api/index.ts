import { Socket } from 'socket.io-client';
import { RoomInfoResponse, StartGameReponse } from '../types/apiTypes';
import { ClientGameState, GameSetupData } from '../types/gameTypes';

export default {
  createRoom(socket: Socket) {
    return new Promise<string>((resolve) => {
      socket.emit('create room', (data: string) => {
        resolve(data);
      });
    });
  },

  getRoomInfo(socket: Socket, roomId: string) {
    return new Promise<RoomInfoResponse>((resolve) => {
      socket.emit('get room info', roomId, (data: RoomInfoResponse) => {
        resolve(data);
      });
    });
  },

  joinRoom(socket: Socket, roomId: string, playerId: string, username: string) {
    return new Promise<ClientGameState>((resolve) => {
      socket.emit('join room', roomId, playerId, username, (data: any) => {
        const gameState: ClientGameState = {
          progress: data.progress,
          players: new Map(data.players),
          self: data.self,
          board: {
            ...data.board,
            players: new Map(data.board?.players),
          },
        };
        resolve(gameState);
      });
    });
  },

  startGame(socket: Socket, gameSetupData: GameSetupData) {
    return new Promise<StartGameReponse>((resolve) => {
      socket.emit('start game', gameSetupData, (data: StartGameReponse) => {
        resolve(data);
      });
    });
  },
};
