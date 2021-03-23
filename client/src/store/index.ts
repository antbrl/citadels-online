import { Socket } from 'socket.io-client';
import { createStore } from 'vuex';
import socket from '../socket';
import { ClientGameState, GameProgress } from '../types/gameTypes';

export interface State {
  socket: Socket
  gameState: ClientGameState | undefined
}

export const store = createStore<State>({
  state: {
    socket,
    gameState: undefined,
  },

  getters: {
    isConnected(state) {
      return state.socket.connected;
    },
    isInRoom(state) {
      return state.gameState !== undefined;
    },
    gameState(state) {
      return state.gameState;
    },
    gameProgress(state) {
      switch (state.gameState?.progress) {
        case GameProgress.IN_LOBBY:
          return 'IN_LOBBY';
        case GameProgress.IN_GAME:
          return 'IN_GAME';
        case GameProgress.FINISHED:
          return 'FINISHED';
        default:
          return 'UNKNOWN';
      }
    },
  },

  mutations: {
    setGameState(state, gameState) {
      state.gameState = gameState;
    },
    resetGameState(state) {
      state.gameState = undefined;
    },
    addPlayer(state, player) {
      if (state.gameState !== undefined) {
        state.gameState.players.set(player.id, player);
      }
    },
    removePlayer(state, playerId) {
      if (state.gameState !== undefined) {
        const player = state.gameState.players.get(playerId);
        if (player !== undefined) {
          console.log(`${player} disconnected`);
          state.gameState.players.delete(playerId);
        }
      }
    },
    setPlayerOnline(state, { playerId, online }) {
      if (state.gameState !== undefined) {
        const player = state.gameState.players.get(playerId);
        if (player) {
          player.online = online;
        }
      }
    },
  },

  actions: {
    createRoom({ state, dispatch }) {
      dispatch('connect');
      return new Promise((resolve) => {
        // TODO: add timeout
        state.socket.emit('create room', (data: string) => {
          resolve(data);
        });
      });
    },
    getRoomInfo({ state, dispatch }, roomId: string) {
      dispatch('connect');
      return new Promise((resolve) => {
        // TODO: add timeout
        state.socket.emit('get room info', roomId, (data: object) => {
          resolve(data);
        });
      });
    },
    joinRoom({ state, commit, dispatch }, { roomId, playerId, username }) {
      dispatch('connect');
      return new Promise((resolve, reject) => {
        // TODO: add timeout
        state.socket.emit('join room', roomId, playerId, username, (data: any) => {
          if (data) {
            const gameState: ClientGameState = {
              progress: data.progress,
              players: new Map(data.players),
              self: data.self,
            };
            localStorage.setItem(roomId, data.self);
            commit('setGameState', gameState);
            resolve(gameState);
          } else {
            reject(new Error('Invalid game state'));
          }
        });
      });
    },
    connect({ state }) {
      if (state.socket.connected) return;
      state.socket.connect();
    },
  },
});
