import { Socket } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

export interface State {
  socket: Socket | null
  players: Map<string, {id: string, name: string}>
  self: {id: string, name: string}
}

export const key: InjectionKey<Store<State>> = Symbol('vuex store injection key');

export default createStore<State>({
  state: {
    socket: null,
    players: new Map(),
    self: { id: '', name: '' },
  },

  getters: {
    isConnected(state) {
      return state.socket && state.socket.connected;
    },
    hasGameStarted(state, getters) {
      return getters.isConnected;
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
    connect({ state }, username) {
      if (!state.socket || state.socket.connected) return;
      state.socket.auth = { username };
      state.socket.connect();
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
