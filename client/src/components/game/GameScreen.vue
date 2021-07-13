<template>
<div class="container-lg p-3">
  <transition name="fade" mode="out-in">
    <div class="h-100" v-if="showLobby">
      <LobbyScreen />
    </div>
    <div class="h-100" v-else-if="showBoard">
      <BoardScreen />
    </div>
    <div class="h-100" v-else>
      Invalid game state: {{ gameProgress }}
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
    showLobby() {
      return this.gameProgress === 'IN_LOBBY';
    },
    showBoard() {
      return this.gameProgress === 'IN_GAME' || this.gameProgress === 'FINISHED';
    },
  },
});
</script>
