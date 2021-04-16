<template>
<div class="card h-100 bg-secondary shadow">
  <div class="row no-gutters h-100">
    <div class="col h-100 d-flex flex-column">
      <div class="px-2 pt-2 flex-fill overflow-auto">
        <PlayerCity
          v-for="[id, board] in otherPlayersBoards"
          :key="id"
          :player-id="id"
          :board="board"
          class="mb-2"
        />
      </div>
      <div class="p-2 bg-dark border-top border-secondary shadow-lg active">
        <PlayerCity
          :player-id="self"
          :board="selfBoard"
        />
        <PlayerHand
          :hand="selfBoard.hand"
          :stash="selfBoard.stash"
          :crown="selfBoard.crown"
        />
      </div>
    </div>
    <div
      class="col-2 p-2 bg-dark border-left border-secondary shadow
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
  },
  methods: {
    showConfirmationModal() {
      store.commit('prepareGameSetupConfirmation');
      $('#setupConfirmationModal').modal();
    },
    startGame() {
      this.startingGame = true;
      store.dispatch('startGame').then(() => {
        this.startingGame = false;
      }).catch((reason) => {
        console.error('error when starting game', reason);
        this.startingGame = false;
      });
    },
  },
  beforeUnmount() {
    $('#setupConfirmationModal').modal('hide');
  },
});
</script>
