<template>
  <LobbyScreen />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LobbyScreen from './LobbyScreen.vue';

export default defineComponent({
  components: { LobbyScreen },
  name: 'CitadelsGame',
});
</script>
