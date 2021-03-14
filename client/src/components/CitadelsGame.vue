<template>
<LobbyScreen v-show="!hasGameStarted" />
<GameScreen v-show="hasGameStarted" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import GameScreen from './GameScreen.vue';
import LobbyScreen from './LobbyScreen.vue';

export default defineComponent({
  components: { LobbyScreen, GameScreen },
  name: 'CitadelsGame',
  computed: {
    ...mapGetters([
      'hasGameStarted',
    ]),
  },
});
</script>
