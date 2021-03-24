<template>
<div class="card h-100 overflow-hidden">
  <div class="row no-gutters h-100">
    <div class="col">
    </div>
    <div class="col-3 p-3 bg-light">
      <PlayersList />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlayersList from './PlayersList.vue';

export default defineComponent({
  components: { PlayersList },
  name: 'LobbyScreen',
});
</script>
