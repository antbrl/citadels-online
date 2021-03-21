<template>
<div class="card">
  <div class="card-header">
    Players
  </div>
  <ul class="list-group list-group-flush text-dark">
    <li
      class="list-group-item"
      v-for="(player) in players"
      :key="player.id"
    >
        {{ player.username }}
        <span v-if="player.id === self" class="badge badge-info">You</span>
        <span v-else-if="player.online" class="badge badge-success">Online</span>
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
    players() {
      return Array.from(this.gameState.players.values());
    },
    self() {
      return this.gameState.self;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
