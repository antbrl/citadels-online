import { Socket } from 'socket.io-client';
import { createStore } from 'vuex';
import {
  CharacterType,
  ClientGameState,
  GameProgress,
  GameSetupData,
  Move,
  PlayerRole,
  districts,
  PlayerId,
  RoomId,
  DistrictId,
} from 'citadels-common';
import socket from '../socket';

import api from '../api';

export interface State {
  socket: Socket
  gameState: ClientGameState | undefined
  gameSetupData: GameSetupData
  selectedCards: DistrictId[]
}

export const store = createStore<State>({
  state: {
    socket,
    gameState: undefined,
    gameSetupData: {
      players: [],
      completeCitySize: 7,
    },
    selectedCards: [],
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
      return (playerId: PlayerId) => state.gameState?.players.get(playerId);
    },
    getDistrictFromId() {
      return (districtId: DistrictId) => districts[districtId as keyof typeof districts];
    },
    charactersList(state) {
      return {
        ...state.gameState?.board.characters,
      };
    },
    currentPlayerId(state) {
      if (state.gameState === undefined) return undefined;
      return state.gameState.board.playerOrder[state.gameState.board.currentPlayer];
    },
    isCurrentPlayerSelf(state, getters) {
      return state.gameState !== undefined && state.gameState.self === getters.currentPlayerId;
    },
    getDistrictDestroyPrice(state, getters) {
      return (playerId: PlayerId, districtId: DistrictId) => {
        if (districtId === 'keep') return -1;

        if (state.gameState === undefined) return -1;
        const player = state.gameState.board.players.get(playerId);
        if (player === undefined) return -1;

        if (player.city.length >= state.gameState.settings.completeCitySize) return -1;

        const isBishopDead = state.gameState.board.characters.callable.find(
          ({ id }) => id === CharacterType.BISHOP,
        )?.killed ?? false;
        const isPlayerBishop = player.characters.some(({ id }) => id === CharacterType.BISHOP);
        if (!isBishopDead && isPlayerBishop) return -1;

        const discount = (
          player.city.includes('great_wall') && districtId !== 'great_wall'
        ) ? 0 : 1;

        return Math.max(getters.getDistrictFromId(districtId)?.cost - discount, 0);
      };
    },
    getPlayerPosition(state) {
      return (playerId: PlayerId) => state.gameState?.board.playerOrder.indexOf(playerId);
    },
    selectedCards(state) {
      return state.selectedCards;
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
    prepareGameSetupConfirmation(state, { completeCitySize }) {
      state.gameSetupData.players = Array.from(state.gameState?.players.values() || [])
        .filter((player) => player.role === PlayerRole.PLAYER)
        .map((player) => player.id);
      state.gameSetupData.completeCitySize = completeCitySize ?? 7;
    },
    setSelectedCards(state, { cards }) {
      state.selectedCards = cards;
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

    async getRoomInfo({ state, dispatch }, roomId: RoomId) {
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

    sendMove({ state }, move: Move) {
      return new Promise((resolve, reject) => {
        if (!state.socket.connected) {
          return reject(new Error('You must be connected'));
        }
        return state.socket.emit('make move', move, (res: any) => {
          if (res.status === 'ok') {
            return resolve(undefined);
          }
          if (res.status === 'error') {
            return reject(new Error(`Error when sending move: ${res.message}`));
          }
          return reject(new Error(`Unknown response type: ${res.status}`));
        });
      });
    },
  },
});
