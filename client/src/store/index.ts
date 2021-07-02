import { Socket } from 'socket.io-client';
import { createStore } from 'vuex';
import socket from '../socket';
import {
  ClientGameState, GameProgress, GameSetupData, PlayerRole,
} from '../types/gameTypes';
import districts from '../data/districts.json';
import api from '../api';

export interface State {
  socket: Socket
  gameState: ClientGameState | undefined
  gameSetupData: GameSetupData
}

export const store = createStore<State>({
  state: {
    socket,
    gameState: undefined,
    gameSetupData: {
      players: [],
    },
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
    gameSetupData(state) {
      return state.gameSetupData;
    },
    getPlayerFromId(state) {
      return (playerId: string) => state.gameState?.players.get(playerId);
    },
    getDistrictFromId() {
      return (districtId: string) => districts[districtId as keyof typeof districts];
    },
    charactersList(state) {
      return {
        ...state.gameState?.board.characters,
      };
    },
  },

  mutations: {
    setGameState(state, gameState) {
      state.gameState = gameState;
      console.log('new game state:', state.gameState);
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
    prepareGameSetupConfirmation(state) {
      state.gameSetupData.players = Array.from(state.gameState?.players.values() || [])
        .filter((player) => player.role === PlayerRole.PLAYER)
        .map((player) => player.id);
    },
  },

  actions: {
    connect({ state }) {
      if (state.socket.connected) return;
      state.socket.connect();
    },

    async createRoom({ state, dispatch }) {
      await dispatch('connect');
      return api.createRoom(state.socket);
    },

    async getRoomInfo({ state, dispatch }, roomId: string) {
      await dispatch('connect');
      return api.getRoomInfo(state.socket, roomId);
    },

    async joinRoom({ state, commit, dispatch }, { roomId, playerId, username }) {
      await dispatch('connect');
      const gameState = await api.joinRoom(state.socket, roomId, playerId, username);
      localStorage.setItem(roomId, gameState.self);
      commit('setGameState', gameState);
      return gameState;
    },

    async startGame({ state, dispatch }) {
      await dispatch('connect');
      const response = await api.startGame(state.socket, state.gameSetupData);
      switch (response.status) {
        case 'error':
          throw new Error(`Error when starting game: ${response.message}`);
        case 'ok':
          // everything is fine
          break;
        default:
          throw new Error(`Unknown response type: ${response.status}`);
      }
    },
  },
});
