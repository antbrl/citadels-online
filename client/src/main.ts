import { createApp } from 'vue';
import $ from 'jquery';
import { Boundary } from 'popper.js';
import router from './router';
import { store } from './store';
import App from './App.vue';
import i18n from './i18n';

import 'bootstrap';
import './scss/main.scss';

const app = createApp(App);

// Input focus directive
app.directive('focus', {
  mounted(el) {
    el.focus();
  },
});

// Bootstrap tooltip directive
const tooltipOptions = { boundary: 'window' as Boundary };
app.directive('tooltip', {
  mounted(el, binding) {
    const title = binding.value ?? '';
    $(el).tooltip({ ...tooltipOptions, title });
  },
  updated(el, binding) {
    $(el).tooltip('dispose');
    const title = binding.value ?? '';
    $(el).tooltip({ ...tooltipOptions, title });
  },
  unmounted(el) {
    $(el).tooltip('dispose');
  },
});

app.use(store);
app.use(router);
app.use(i18n);
app.mount('#app');
