<template>
  <div class="w-100 card bg-secondary shadow-sm" style="min-width: 9em;">
    <div class="p-1 text-light d-flex flex-column">
      <div class="bg-dark p-1 flex-fill rounded d-flex flex-column">
        <h5><span class="badge w-100">{{ username }}</span></h5>
        <p class="text-center">
          <span v-if="board.crown" class="badge badge-pill badge-danger p-2 mr-2">
            <emoji emoji="👑"></emoji>
          </span>
          <span class="badge badge-pill badge-secondary p-2 mr-2">
            {{ board.stash }} <emoji emoji="🪙"></emoji>
          </span>
          <span
            class="badge badge-pill p-2"
            :class="{
              'badge-secondary': !exchangeHandMode,
              'badge-primary cursor-pointer': exchangeHandMode,
            }"
            @click="exchangeHand()"
            v-tooltip="exchangeHandMode ? $t('ui.game.actions.choose_hand') : ''"
          >{{ board.hand.length }} <emoji emoji="🃏"></emoji></span>
        </p>
        <CharactersList v-if="gameProgress === 'IN_GAME'" :characters="board.characters" />
      </div>
    </div>
    <div class="p-2 bg-secondary d-flex justify-content-center flex-wrap overflow-auto gap-2">
      <DistrictCard
        v-for="id, i in board.city"
        :key="i"
        :district-id="id"
        @click="chooseCardDestroy(id)"
        :disabled="destroyMode && !canDestroy(id)"
        :selectable="canDestroy(id)"
        small
      />
    </div>
    <PlayerScore v-if="gameProgress === 'FINISHED'" :score="board.score" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { store } from '../../../store';
import { Move, MoveType } from '../../../types/gameTypes';
import CharactersList from './CharactersList.vue';
import DistrictCard from './DistrictCard.vue';
import PlayerScore from './PlayerScore.vue';

export default defineComponent({
  name: 'PlayerCity',
  components: {
    DistrictCard,
    CharactersList,
    PlayerScore,
  },
  props: {
    playerId: {
      type: String,
      required: true,
    },
    board: {
      required: true,
    },
    destroyMode: {
      type: Boolean,
      default: false,
    },
    exchangeHandMode: {
      type: Boolean,
      default: false,
    },
    stash: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters([
      'getPlayerFromId',
      'gameProgress',
    ]),
    username() {
      return this.getPlayerFromId(this.playerId)?.username;
    },
  },
  methods: {
    canDestroy(name: string): boolean {
      if (!this.destroyMode) return false;
      const cost = store.getters.getDistrictDestroyPrice(this.playerId, name);
      return cost >= 0 && cost <= this.stash;
    },
    async chooseCardDestroy(name: string) {
      if (!this.canDestroy(name)) return;

      try {
        const move: Move = {
          type: MoveType.WARLORD_DESTROY_DISTRICT,
          data: {
            player: store.getters.getPlayerPosition(this.playerId),
            card: name,
          },
        };
        await store.dispatch('sendMove', move);
      } catch (error) {
        console.log('error when sending move', error);
      }
    },
    async exchangeHand() {
      if (!this.exchangeHandMode) return;

      try {
        const move: Move = {
          type: MoveType.MAGICIAN_EXCHANGE_HAND,
          data: store.getters.getPlayerPosition(this.playerId),
        };
        await store.dispatch('sendMove', move);
      } catch (error) {
        console.log('error when sending move', error);
      }
    },
  },
});
</script>
