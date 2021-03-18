import { createRouter, createWebHistory } from 'vue-router';

import HomeScreen from '../components/game/HomeScreen.vue';
import NewRoomScreen from '../components/game/NewRoomScreen.vue';
import RoomScreen from '../components/game/RoomScreen.vue';

const routes = [
  { path: '/', component: HomeScreen },
  { path: '/new-room', name: 'create-room', component: NewRoomScreen },
  { path: '/room/:roomId', name: 'join-room', component: RoomScreen },

  // catch all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
