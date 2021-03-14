import { createApp } from 'vue';
import store from './store';
import socket from './socket';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import './scss/main.scss';

const app = createApp(App);

store.state.socket = socket;

app.use(store);
app.mount('#app');
