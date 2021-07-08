<template>
<div class="card h-100 bg-dark border-dark shadow">
  <div class="row no-gutters h-100">
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
          />
        </div>
      </div>
      <div class="px-2 pt-2 bg-gradient-dark border-top border-secondary">
        <PlayerCity
          :player-id="self"
          :board="selfBoard"
        />
        <PlayerHand
          :hand="selfBoard.hand"
          :tmp-hand="selfBoard.tmpHand"
          :stash="selfBoard.stash"
          :crown="selfBoard.crown"
          :city="selfBoard.city"
          :buildMode="buildMode"
        />
      </div>
    </div>
    <div
      class="col-2 p-2 bg-dark border-left border-secondary
      h-100 d-flex flex-column justify-content-between overflow-auto"
    >
      <CharactersList
        :title="$t('ui.game.characters')"
        :characters="charactersList.callable"
        :current="charactersList.current"
      />
      <CharactersList :characters="charactersList.aside" />
    </div>
  </div>
  <div class="card-footer border-top border-secondary h5 p-2 m-0 d-flex" :class="{
      'bg-secondary': statusBar.type === 'NORMAL',
      'bg-primary': statusBar.type === 'HIGHLIGHTED',
      'bg-danger': statusBar.type === 'ERROR',
    }">
    <!-- status message -->
    <div class="flex-fill badge badge-lg py-3 text-light">
      {{ $t(statusBar.message, statusBar.args) }}
    </div>
    <!-- actions -->
    <input
      v-for="(action, i) in statusBar.actions"
      :key="i"
      type="button"
      class="btn btn-light ml-2 font-weight-bold"
      :value="$t(`ui.game.actions.${action.title}`)"
      @click="sendMove(action.move)"
    >
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
import { ClientTurnState, Move } from '../../types/gameTypes';
import { getStatusBarData } from '../../data/statusBarData';

export default defineComponent({
  components: { CharactersList, PlayerCity, PlayerHand },
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
    ]),
    self() {
      return this.gameState.self;
    },
    otherPlayersBoards() {
      return this.gameState.board.players.filter((player) => player[0] !== this.self)
        .map((board) => ([board[0], {
          ...board[1],
          crown: this.gameState.board.crown === board[0],
        }]));
    },
    selfBoard() {
      return {
        ...this.gameState.board.players.filter((player) => player[0] === this.self)[0][1],
        crown: this.gameState.board.crown === this.self,
      };
    },
    statusBar() {
      return getStatusBarData(this.gameState);
    },
    buildMode() {
      return this.isCurrentPlayerSelf
      && this.gameState.board.turnState === ClientTurnState.BUILD_DISTRICT;
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
    async sendMove(move: Move) {
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
