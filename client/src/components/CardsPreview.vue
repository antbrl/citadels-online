<template>
<div class="container-lg d-flex justify-content-center flex-wrap">
  <DistrictCard
    v-for="card in cards"
    :key="card"
    :district-id="card"
    class="m-1"
  />
  <div class="w-100"></div>
  <DistrictCard
    v-for="card in cards"
    :key="card"
    :district-id="card"
    class="m-1"
    small
  />
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { districts, DistrictId } from 'citadels-common';
import DistrictCard from './game/elements/DistrictCard.vue';

export default defineComponent({
  name: 'CardsPreview',
  components: {
    DistrictCard,
  },
  computed: {
    cards(): DistrictId[] {
      return Object.keys(districts);
    },
  },
});
</script>
