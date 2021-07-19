<template>
<div class="card h-100 bg-dark border-dark shadow">
  <div class="row no-gutters h-100 overflow-auto">
    <div class="col-10 h-100 d-flex flex-column">
      <div class="flex-fill bg-dark d-flex flex-column overflow-auto">
        <div
          class="p-2 mb-n2"
          v-for="[id, board] in otherPlayersBoards"
          :key="id"
        >
          <PlayerCity
            :player-id="id"
            :board="board"
            :destroy-mode="destroyMode"
            :stash="selfBoard.stash"
            :exchange-hand-mode="exchangeHandMode"
          />
        </div>
      </div>
      <div class="px-2 pt-2 bg-gradient-dark border-top border-secondary">
        <PlayerCity
          :player-id="self"
          :board="selfBoard"
          :destroy-mode="destroyMode"
          :stash="selfBoard.stash"
        />
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
    class="card-footer border-top border-secondary h5 p-2 m-0
      d-flex flex-wrap align-items-stretch justify-content-center"
    :class="{
      'bg-secondary': statusBar.type === 'NORMAL',
      'bg-primary': statusBar.type === 'HIGHLIGHTED',
      'bg-danger': statusBar.type === 'ERROR',
    }"
  >
    <!-- status message -->
    <div class="flex-fill badge badge-lg py-3 text-light text-wrap">
      {{ $t(statusBar.message, statusBar.args) }}
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
import { store } from '../../store';
import CharactersList from './elements/CharactersList.vue';
import PlayerCity from './elements/PlayerCity.vue';
import PlayerHand from './elements/PlayerHand.vue';
import DistrictCard from './elements/DistrictCard.vue';
import { ClientTurnState, Move } from '../../types/gameTypes';
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
    otherPlayersBoards() {
      return [...this.gameState.board.players].filter(([player]) => player !== this.self)
        .map(([player, board]) => ([player, {
          ...board,
          crown: this.gameState.board.playerOrder[0] === player,
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
});
</script>
