<template>
<h1>Citadels</h1>
<div class="body">
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
h1 {
  text-align: center;
  background: brown;
  color: wheat;
  margin: 0;
  padding: 0.5em;
}

.body {
  background: wheat;
  flex-grow: 1;
}
</style>
