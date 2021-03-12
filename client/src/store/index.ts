import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      socket: null,
    };
  },

  getters: {
    isConnected(state) {
      return state.socket && state.socket.connected;
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
