<template>
  <div :id="containerId" v-if="downloaded" />
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
    initialize() {
      return this.isConnected;
    },
  },
});
</script>

<style scoped>
label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
