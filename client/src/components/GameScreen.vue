<template>
  <ion-phaser
    :game.prop="game"
    :initialize.prop="initialize"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import Phaser from 'phaser';

export default defineComponent({
  name: 'CitadelsGame',
  data() {
    return {
      game: {
        width: '100%',
        height: '100%',
        type: Phaser.AUTO,
        scene: {
          init() {
            this.cameras.main.setBackgroundColor('#24252A');
          },
          create() {
            this.helloWorld = this.add.text(
              this.cameras.main.centerX,
              this.cameras.main.centerY,
              'Hello World',
              { font: '40px Arial', fill: '#ffffff' },
            );
            this.helloWorld.setOrigin(0.5);
          },
          update() {
            this.helloWorld.angle += 1;
          },
        },
      },
    };
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
