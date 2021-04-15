<template>
<div class="pt-2 d-flex justify-content-start overflow-auto">
  <div v-if="hand.length === 0" style="height: 9em;"></div>
  <DistrictCard
    v-else
    v-for="id, i in hand"
    :key="i"
    :district-id="id"
    class="mr-2"
  />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DistrictCard from './DistrictCard.vue';

export default defineComponent({
  name: 'PlayerHand',
  components: {
    DistrictCard,
  },
  props: {
    hand: {
      required: true,
    },
  },
});
</script>
