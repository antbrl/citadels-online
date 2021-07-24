import { createRouter, createWebHistory } from 'vue-router';

import HomeScreen from '../components/HomeScreen.vue';
import RoomScreen from '../components/game/RoomScreen.vue';
import CardsPreview from '../components/CardsPreview.vue';
import { updateTitle } from '../i18n';

const routes = [
  { path: '/', component: HomeScreen },
  { path: '/room/:roomId', name: 'join-room', component: RoomScreen },
  { path: '/cards', name: 'cards', component: CardsPreview },

  // catch all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  updateTitle();
  next();
});

export default router;
