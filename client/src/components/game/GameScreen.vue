<template>
<div class="game-container container-lg p-3">
  <transition name="fade" mode="out-in">
    <div v-if="gameProgress === 'IN_LOBBY'">
      <LobbyScreen />
    </div>
    <div v-else-if="gameProgress === 'IN_GAME'">
      GAME
    </div>
    <div v-else-if="gameProgress === 'FINISHED'">
      FINISHED
    </div>
    <div v-else>
      Invalid game state progress: {{ gameProgress }}
    </div>
  </transition>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import LobbyScreen from './LobbyScreen.vue';

export default defineComponent({
  components: { LobbyScreen },
  name: 'GameScreen',
  computed: {
    ...mapGetters([
      'gameProgress',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.game-container > div {
  height: 100%;
}
</style>
