<template>
<h1>Citadels</h1>
<div class="game">
  <CitadelsGame />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CitadelsGame from './components/CitadelsGame.vue';

export default defineComponent({
  name: 'App',
  components: {
    CitadelsGame,
  },
});
</script>

<style scoped>
h1 {
  text-align: center;
  background: brown;
  color: wheat;
  margin: 0;
  padding: 1em;
}

.game {
  background: wheat;
  flex-grow: 1;
}
</style>
