<template>
<RoomEntryScreen v-if="!isInRoom" />
<GameScreen v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import GameScreen from './GameScreen.vue';
import RoomEntryScreen from './RoomEntryScreen.vue';
import { store } from '../../store';

export default defineComponent({
  components: { RoomEntryScreen, GameScreen },
  name: 'RoomScreen',
  computed: {
    ...mapGetters([
      'isInRoom',
    ]),
  },
  unmounted() {
    store.commit('resetGameState');
  },
});
</script>
