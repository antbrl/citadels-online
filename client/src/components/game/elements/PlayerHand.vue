<template>
<div class="py-2 d-flex justify-content-start align-items-end overflow-auto">
  <div v-if="crown" class="crown card rounded-pill bg-danger p-3 m-2 shadow-sm">👑</div>
  <div class="mr-auto"></div>
  <DistrictCard
    v-for="id, i in hand"
    :key="i"
    :district-id="id"
    class="mr-2"
    :disabled="showTmpHand"
  />
  <div
    v-if="showTmpHand"
    class="bg-light d-flex justify-content-start pl-2 py-2 my-n2"
  >
    <DistrictCard
      v-for="id, i in tmpHand"
      :key="i"
      :district-id="id"
      class="mr-2"
      @click="chooseCard(id)"
      :selectable="showTmpHand"
    />
  </div>
  <div
    class="stash d-flex flex-column-reverse flex-wrap-reverse justify-content-start ml-auto"
  ><span v-for="i in stash" :key="i" class="coin">🪙</span></div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { store } from '../../../store';
import { Move, MoveType } from '../../../types/gameTypes';
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
    tmpHand: {
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
  computed: {
    showTmpHand() {
      return this.tmpHand.length > 0;
    },
  },
  methods: {
    async chooseCard(name: string) {
      const move: Move = { type: MoveType.DRAW_CARDS, data: name };
      try {
        await store.dispatch('sendMove', move);
      } catch (error) {
        console.log('error when sending move', error);
      }
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
