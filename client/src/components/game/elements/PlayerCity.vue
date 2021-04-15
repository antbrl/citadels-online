<template>
<div class="card bg-secondary shadow-sm overflow-hidden">
  <div class="row no-gutters h-100">
    <div class="col-2 p-2 bg-dark text-light d-flex flex-column">
      <div class="flex-fill">
        <h5><span class="badge badge-light w-100">{{ username }}</span></h5>
        <p class="text-center">
          <span class="badge badge-pill badge-secondary p-2 mr-2">{{ board.stash }} 🪙</span>
          <span class="badge badge-pill badge-secondary p-2">{{ board.hand.length }} 🃏</span>
        </p>
      </div>
      <div>
        <CharactersList :characters="[]" />
      </div>
    </div>
    <div class="col py-2 pl-2 bg-light d-flex justify-content-start overflow-auto">
      <div v-if="board.city.length === 0" style="height: 9em;"></div>
      <DistrictCard
        v-else
        v-for="id, i in board.city"
        :key="i"
        :district-id="id"
        class="pr-2"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import CharactersList from './CharactersList.vue';
import DistrictCard from './DistrictCard.vue';

export default defineComponent({
  name: 'PlayerCity',
  components: {
    DistrictCard,
    CharactersList,
  },
  props: {
    playerId: {
      type: String,
      required: true,
    },
    board: {
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'getPlayerFromId',
    ]),
    username() {
      return this.getPlayerFromId(this.playerId)?.username;
    },
  },
});
</script>
