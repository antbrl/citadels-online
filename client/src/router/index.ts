import { createRouter, createWebHistory } from 'vue-router';

import HomeScreen from '../components/HomeScreen.vue';
import RoomScreen from '../components/game/RoomScreen.vue';

const routes = [
  { path: '/', component: HomeScreen },
  { path: '/room/:roomId', name: 'join-room', component: RoomScreen },

  // catch all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
