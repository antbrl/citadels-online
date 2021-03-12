import { createApp } from 'vue';
import { io } from 'socket.io-client';
import store from './store';
import App from './App.vue';

const app = createApp(App);

// socket
const socket = io('http://localhost:8081', {
  path: '/s/',
  autoConnect: false,
});
store.state.socket = socket;

app.use(store);
app.mount('#app');
