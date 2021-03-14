import { io } from 'socket.io-client';
import store from '../store';

const socket = io('/', {
  path: '/s/',
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.debug('socket:', event, args);
});

socket.on('connect_error', (err) => {
  alert(err.message);
});

socket.on('connect', () => {
  console.log('connected with socket id', socket.id);
});
socket.on('disconnect', () => {
  console.log('disconnected');
});
socket.on('currentPlayers', (players) => {
  Object.keys(players).forEach((playerId) => {
    if (playerId === socket.id) {
      store.commit('setSelf', players[playerId]);
    } else {
      store.commit('addPlayer', players[playerId]);
    }
  });
});
socket.on('newPlayer', (player) => {
  console.log(`${player.name} connected`);
  store.commit('addPlayer', player);
});
socket.on('disconnectPlayer', (playerId) => {
  store.commit('removePlayer', playerId);
});

export default socket;
