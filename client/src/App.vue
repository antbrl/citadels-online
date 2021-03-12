<template>
  <h1>Citadels</h1>
  <CitadelsGame />
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
