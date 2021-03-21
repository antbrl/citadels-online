<template>
<LobbyScreen v-if="!hasGameStarted" />
<GameScreen v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import GameScreen from './GameScreen.vue';
import LobbyScreen from './LobbyScreen.vue';
import { store } from '../../store';

export default defineComponent({
  components: { LobbyScreen, GameScreen },
  name: 'RoomScreen',
  computed: {
    ...mapGetters([
      'hasGameStarted',
    ]),
  },
  unmounted() {
    store.commit('resetGameState');
  },
});
</script>
