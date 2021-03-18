import { createApp } from 'vue';
import router from './router';
import store from './store';
import socket from './socket';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import './scss/main.scss';

const app = createApp(App);

store.state.socket = socket;

app.use(store);
app.use(router);
app.mount('#app');
