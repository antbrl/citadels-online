<template>
<div class="game-container" :id="containerId" v-if="downloaded"></div>
<div v-else>
  Downloading, please wait...
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'CitadelsGame',
  data() {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container',
    };
  },
  async mounted() {
    const game = await import('../game/game');
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId);
    });
  },
  unmounted() {
    this.gameInstance.destroy(false);
  },
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
}
</style>
