import { Socket } from 'socket.io-client';
import { createStore } from 'vuex';
import socket from '../socket';

export interface State {
  socket: Socket
  players: Map<string, {id: string, name: string}>
  self: {id: string, name: string}
}

export const store = createStore<State>({
  state: {
    socket,
    players: new Map(),
    self: { id: '', name: '' },
  },

  getters: {
    isConnected(state) {
      return state.socket.connected;
    },
    hasGameStarted() {
      return false;
    },
    players(state) {
      return state.players.values();
    },
    self(state) {
      return state.self;
    },
  },

  mutations: {
    addPlayer(state, player) {
      state.players.set(player.id, player);
    },
    removePlayer(state, playerId) {
      const player = state.players.get(playerId);
      if (player !== undefined) {
        console.log(`${player.name} disconnected`);
        state.players.delete(playerId);
      }
    },
    setSelf(state, player) {
      state.self = player;
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
    joinRoom({ state, dispatch }, roomId: string) {
      dispatch('connect');
      return new Promise((resolve, reject) => {
        // TODO: add timeout
        state.socket.emit('join room', roomId, (data: object) => {
          if (data instanceof Error) {
            reject(data);
          } else {
            resolve(data);
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
