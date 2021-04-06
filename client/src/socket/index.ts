import { io } from 'socket.io-client';
import { store } from '../store';
import { ClientGameState } from '../types/gameTypes';

const socket = io('/', {
  path: '/s/',
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.debug('socket:', event, args);
});

socket.on('connect_error', (err) => {
  console.error('connection error:', err.message);
});

socket.on('connect', () => {
  console.log('connected with socket id', socket.id);
});
socket.on('disconnect', () => {
  console.log('disconnected');
});
socket.on('add player', (player) => {
  console.log(`player ${player.username} [${player.id}] added`);
  store.commit('addPlayer', player);
});
socket.on('joined room', (playerId) => {
  console.log(`player ${playerId} joined room`);
  store.commit('setPlayerOnline', { playerId, online: true });
});
socket.on('left room', (playerId) => {
  console.log(`player ${playerId} left room`);
  store.commit('setPlayerOnline', { playerId, online: false });
});
socket.on('disconnectPlayer', (playerId) => {
  store.commit('removePlayer', playerId);
});
socket.on('update game state', (data) => {
  console.log('data', data);

  const newGameState: ClientGameState = {
    progress: data.progress,
    players: new Map(data.players),
    self: data.self,
    board: {
      players: new Map(data.board?.players),
      ...data.board,
    },
  };
  store.commit('setGameState', newGameState);
});

export default socket;
