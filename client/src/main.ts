import { createApp } from 'vue';
import $ from 'jquery';
import router from './router';
import { store } from './store';
import App from './App.vue';
import i18n from './i18n';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/main.scss';

const app = createApp(App);

// Input focus directive
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});

// Bootstrap tooltip directive
app.directive('tooltip', {
  mounted(el) {
    $(el).tooltip();
  },
  updated(el) {
    $(el).tooltip('dispose');
    $(el).tooltip();
  },
});

app.use(store);
app.use(router);
app.use(i18n);
app.mount('#app');
