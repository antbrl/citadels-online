<template>
<div class="game-container">
  <PlayersList />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import PlayersList from './game/PlayersList.vue';

export default defineComponent({
  components: { PlayersList },
  name: 'CitadelsGame',
  computed: {
    ...mapGetters([
      'isConnected',
    ]),
  },
});
</script>

<style lang="scss" scoped>
.game-container {
  width: 100%;
  height: 100%;
  padding: 1em;
}
</style>
