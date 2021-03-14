<template>
<div class="card border-dark">
  <div class="card-header">
    Players
  </div>
  <ul class="list-group list-group-flush text-dark">
    <li class="list-group-item font-weight-bold">{{ self.name }} (self)</li>
    <li class="list-group-item" v-for="player in players" :key="player.id">
        {{ player.name }}
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'PlayersList',
  computed: {
    ...mapGetters([
      'players',
      'self',
    ]),
  },
});
</script>

<style lang="scss" scoped>
</style>
