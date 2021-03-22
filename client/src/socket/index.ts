import { io } from 'socket.io-client';
import { store } from '../store';

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

export default socket;
