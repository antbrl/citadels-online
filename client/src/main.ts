import { createApp } from 'vue';
import router from './router';
import { store } from './store';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import './scss/main.scss';

const app = createApp(App);

app.use(store);
app.use(router);
app.mount('#app');
