<template>
<div class="pt-2 d-flex justify-content-start align-items-end overflow-auto">
  <div v-if="crown" class="crown card rounded-pill bg-danger p-3 m-2 shadow-sm">👑</div>
  <div class="mr-auto"></div>
  <DistrictCard
    v-for="id, i in hand"
    :key="i"
    :district-id="id"
    class="mr-2"
  />
  <div
    class="stash d-flex flex-column-reverse flex-wrap-reverse justify-content-start ml-auto"
  ><span v-for="i in stash" :key="i" class="coin">🪙</span></div>
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
      type: Array,
      required: true,
    },
    stash: {
      type: Number,
      required: true,
    },
    crown: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.stash {
  height: 9em;
}

.coin {
  font-size: 2em;
  height: .8em;
  position: relative;
  bottom: .8em;
  text-shadow: 0 -1px 2px rgba(0, 0, 0, .2);
}

.crown {
  font-size: 2em;
  min-width: 2.5em;
  text-align: center;
}
</style>
