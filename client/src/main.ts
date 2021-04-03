import { createApp } from 'vue';
import router from './router';
import { store } from './store';
import App from './App.vue';
import i18n from './i18n';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/main.scss';

const app = createApp(App);

// Register a global custom directive called `v-focus`
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});

app.use(store);
app.use(router);
app.use(i18n);
app.mount('#app');
