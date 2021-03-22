<template>
<div class="card">
  <div class="card-header">
    Players
  </div>
  <ul class="list-group list-group-flush text-dark">
    <li class="list-group-item">
        {{ self.username }} <span class="badge badge-info">You</span>
    </li>
    <li
      class="list-group-item"
      v-for="(player) in otherPlayers"
      :key="player.id"
    >
        {{ player.username }}
        <span v-if="player.online" class="badge badge-success">Online</span>
        <span v-else class="badge badge-secondary">Offline</span>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'PlayersList',
  computed: {
    ...mapGetters([
      'gameState',
    ]),
    otherPlayers() {
      return Array.from(this.gameState.players.values())
        .filter((player) => player.id !== this.gameState.self);
    },
    self() {
      return this.gameState.players.get(this.gameState.self);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
