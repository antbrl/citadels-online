import { Socket } from 'socket.io-client';
import {
  ClientGameState, GameSetupData, PlayerId, RoomId,
} from 'citadels-common';
import { RoomInfoResponse, StartGameReponse } from '../types/apiTypes';

export default {
  createRoom(socket: Socket) {
    return new Promise<RoomId>((resolve) => {
      socket.emit('create room', (data: RoomId) => {
        resolve(data);
      });
    });
  },

  getRoomInfo(socket: Socket, roomId: RoomId) {
    return new Promise<RoomInfoResponse>((resolve) => {
      socket.emit('get room info', roomId, (data: RoomInfoResponse) => {
        resolve(data);
      });
    });
  },

  joinRoom(socket: Socket, roomId: RoomId, playerId: PlayerId, username: string) {
    return new Promise<ClientGameState>((resolve, reject) => {
      socket.emit('join room', roomId, playerId, username, (data: any) => {
        if (data === null) {
          return reject(Error('game state is null'));
        }
        const gameState: ClientGameState = {
          progress: data.progress,
          players: new Map(data.players),
          self: data.self,
          board: {
            ...data.board,
            players: new Map(data.board?.players),
          },
          settings: data.settings,
        };
        return resolve(gameState);
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
