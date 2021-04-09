<template>
<div class="container-lg p-3">
  <transition name="fade" mode="out-in">
    <div class="h-100" v-if="gameProgress === 'IN_LOBBY'">
      <LobbyScreen />
    </div>
    <div class="h-100" v-else-if="gameProgress === 'IN_GAME'">
      <BoardScreen />
    </div>
    <div class="h-100" v-else-if="gameProgress === 'FINISHED'">
      FINISHED
    </div>
    <div class="h-100" v-else>
      Invalid game state progress: {{ gameProgress }}
    </div>
  </transition>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import BoardScreen from './BoardScreen.vue';
import LobbyScreen from './LobbyScreen.vue';

export default defineComponent({
  components: { LobbyScreen, BoardScreen },
  name: 'GameScreen',
  computed: {
    ...mapGetters([
      'gameProgress',
    ]),
  },
});
</script>
