<template>
<div class="card">
  <div class="card-header">
    {{ $t('ui.lobby.players') }}
  </div>
  <ul class="list-group list-group-flush text-dark">
    <li class="list-group-item">
        {{ self.username }}
        <span class="badge badge-info">{{ $t('ui.lobby.you') }}</span>
        <span v-if="self.manager" class="badge badge-danger">{{ $t('ui.lobby.manager') }}</span>
    </li>
    <li
      class="list-group-item"
      v-for="(player) in otherPlayers"
      :key="player.id"
    >
        {{ player.username }}
        <span v-if="player.online" class="badge badge-success">{{ $t('ui.lobby.online') }}</span>
        <span v-else class="badge badge-secondary">{{ $t('ui.lobby.offline') }}</span>
        <span v-if="player.manager" class="badge badge-danger">{{ $t('ui.lobby.manager') }}</span>
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
