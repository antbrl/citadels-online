<template>
<div class="card h-100">
  <div class="card-header">Game Setup</div>
  <div class="row no-gutters h-100">
    <div class="col p-3">
      <p class="text-muted">No settings for now.</p>
    </div>
    <div class="col-3 p-3 bg-light">
      <PlayersList />
    </div>
  </div>
  <div class="card-footer">
    <input
    type="button"
    class="btn btn-primary btn-lg btn-block"
    value="Start Game"
    @click="showConfirmationModal"
  >
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlayersList from './PlayersList.vue';

export default defineComponent({
  components: { PlayersList },
  name: 'LobbyScreen',
  methods: {
    showConfirmationModal() {
    },
  },
});
</script>
