<template>
<div class="game-container container-lg p-3">
  <div class="card h-100 overflow-hidden">
    <div class="row no-gutters h-100">
      <div class="col">
      </div>
      <div class="col-3 p-3 bg-light">
        <PlayersList />
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import PlayersList from './PlayersList.vue';

export default defineComponent({
  components: { PlayersList },
  name: 'GameScreen',
  computed: {
    ...mapGetters([
      'isConnected',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.game-container {
  height: 100%;
}
</style>
