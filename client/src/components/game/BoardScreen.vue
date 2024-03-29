<template>
<div class="d-flex flex-column h-100 bg-dark border-dark shadow">
  <div class="row no-gutters h-100 overflow-auto">
    <div class="col-10 h-100 d-flex flex-column">
      <div class="flex-fill bg-dark d-flex overflow-auto p-2 gap-2">
        <div
          class="col p-0 d-flex"
          v-for="[playerId, board] in playerBoards"
          :key="playerId"
        >
          <PlayerCity
            :player-id="playerId"
            :board="board"
            :destroy-mode="destroyMode"
            :stash="selfBoard.stash"
            :exchange-hand-mode="exchangeHandMode"
          />
        </div>
      </div>
      <div class="px-2 bg-gradient-dark border-top border-secondary">
        <PlayerHand
          :board="selfBoard"
          :build-mode="buildMode"
          :discard-cards-mode="discardCardsMode"
          :laboratory-mode="laboratoryMode"
        />
      </div>
    </div>
    <div
      class="col-2 p-2 bg-dark border-left border-secondary
      h-100 d-flex flex-column justify-content-between overflow-auto"
    >
      <CharactersList
        v-if="gameProgress === 'IN_GAME'"
        :title="$t('ui.game.characters')"
        :characters="charactersList.callable"
        :current="charactersList.current"
        :kill-mode="killMode"
        :rob-mode="robMode"
        :put-aside-mode="putAsideMode"
      />
      <div
        v-if="gameProgress === 'IN_GAME' && showGraveyard"
        class="card bg-secondary flex flex-column"
      >
        <div class="card-header text-light text-center px-0">
          {{ $t('districts.graveyard.name') }}
        </div>
        <DistrictCard
          class="align-self-center my-2"
          :district-id="gameState.board.graveyard"
        />
      </div>
      <CharactersList
        v-if="gameProgress === 'IN_GAME'"
        :characters="charactersList.aside"
      />
    </div>
  </div>
  <div
    class="border-top border-secondary h5 p-2 m-0
      d-flex flex-wrap align-items-stretch justify-content-center"
    :class="{
      'bg-secondary': statusBar.type === 'NORMAL',
      'bg-primary': statusBar.type === 'HIGHLIGHTED',
      'bg-danger': statusBar.type === 'ERROR',
    }"
  >
    <!-- status message -->
    <div
      class="flex-fill badge badge-lg py-3 text-light text-wrap animate-text"
      ref="statusBarMessage"
    >
      <span
        v-for="c, i in [...$t(statusBar.message, statusBar.args)]"
        :key="i"
      >{{ c }}</span>
    </div>
    <!-- actions -->
    <div class="text-center d-flex flex-wrap align-items-stretch justify-content-center m-n1">
      <input
        v-for="(action, i) in statusBar.actions"
        :key="i"
        type="button"
        class="btn btn-sm btn-light m-1 font-weight-bold"
        :value="$t(`ui.game.actions.${action.title}`, action.args)"
        @click="sendMove(action.move, $event.target)"
      >
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { CharacterChoosingStateType as CCST, ClientTurnState, Move } from 'citadels-common';
import { store } from '../../store';
import CharactersList from './elements/CharactersList.vue';
import PlayerCity from './elements/PlayerCity.vue';
import PlayerHand from './elements/PlayerHand.vue';
import DistrictCard from './elements/DistrictCard.vue';
import { getStatusBarData } from '../../data/statusBarData';

export default defineComponent({
  components: {
    CharactersList,
    PlayerCity,
    PlayerHand,
    DistrictCard,
  },
  name: 'LobbyScreen',
  data() {
    return {
      startingGame: false,
    };
  },
  computed: {
    ...mapGetters([
      'getPlayerFromId',
      'gameSetupData',
      'gameState',
      'charactersList',
      'isCurrentPlayerSelf',
      'gameProgress',
    ]),
    self() {
      return this.gameState.self;
    },
    playerBoards() {
      const players = [...this.gameState.board.playerOrder];
      const cutOut = players.splice(players.indexOf(this.gameState.self));
      players.splice(0, 0, ...cutOut);
      return players.map((playerId) => (
        [playerId, {
          ...this.gameState.board.players.get(playerId),
          crown: this.gameState.board.playerOrder[0] === playerId,
        }]));
    },
    selfBoard() {
      return {
        ...this.gameState.board.players.get(this.self),
        crown: this.gameState.board.playerOrder[0] === this.self,
      };
    },
    statusBar() {
      return getStatusBarData(this.gameState);
    },
    buildMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.BUILD_DISTRICT;
    },
    destroyMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.WARLORD_DESTROY_DISTRICT;
    },
    killMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.ASSASSIN_KILL;
    },
    robMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.THIEF_ROB;
    },
    putAsideMode() {
      if (!this.isCurrentPlayerSelf) return false;
      switch (this.gameState.board.characters.state.type) {
        case CCST.PUT_ASIDE_FACE_UP:
        case CCST.PUT_ASIDE_FACE_DOWN:
        case CCST.PUT_ASIDE_FACE_DOWN_UP:
          return true;
        default:
          return false;
      }
    },
    exchangeHandMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.MAGICIAN_EXCHANGE_HAND;
    },
    discardCardsMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.MAGICIAN_DISCARD_CARDS;
    },
    laboratoryMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.LABORATORY_DISCARD_CARD;
    },
    showGraveyard() {
      return this.gameState.board.graveyard !== undefined;
    },
  },
  methods: {
    showConfirmationModal() {
      store.commit('prepareGameSetupConfirmation');
      $('#setupConfirmationModal').modal();
    },
    async startGame() {
      this.startingGame = true;
      try {
        await store.dispatch('startGame');
        this.startingGame = false;
      } catch (error) {
        console.error('error when starting game', error);
        this.startingGame = false;
      }
    },
    async sendMove(move: Move, target: HTMLElement) {
      target.blur();
      try {
        await store.dispatch('sendMove', move);
      } catch (error) {
        console.log('error when sending move', error);
      }
    },
  },
  beforeUnmount() {
    $('#setupConfirmationModal').modal('hide');
  },
  watch: {
    statusBar(oldVal, newVal) {
      if (oldVal.message !== newVal.message) {
        const el = this.$refs.statusBarMessage;
        el.classList.remove('animate-text');
        // eslint-disable-next-line no-void
        void el.offsetWidth;
        el.classList.add('animate-text');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes animate-text {
  0% {
    top: 1rem;
    opacity: 0;
  }
  80% {
    top: -0.1rem;
    opacity: 1;
  }
  100% {
    top: 0;
    opacity: 1;
  }
}
.animate-text {
  > span {
    position: relative;
    animation: animate-text .3s both;

    @for $i from 0 to 7 {
      &:nth-child(#{$i}n) {
        animation-delay: $i * .05s;
      }
    }
  }
}
</style>
