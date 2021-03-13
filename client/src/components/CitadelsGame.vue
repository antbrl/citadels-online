<template>
  <LobbyScreen />
  <GameScreen />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GameScreen from './GameScreen.vue';
import LobbyScreen from './LobbyScreen.vue';

export default defineComponent({
  components: { LobbyScreen, GameScreen },
  name: 'CitadelsGame',
});
</script>
