<template>
<div class="card h-100 bg-dark border-dark shadow">
  <div class="row no-gutters h-100 overflow-hidden">
    <div class="col h-100 d-flex flex-column">
      <div class="flex-fill bg-secondary d-flex flex-column overflow-auto">
        <div
          class="bg-dark p-2 mb-2"
          v-for="[id, board] in otherPlayersBoards"
          :key="id"
        >
          <PlayerCity
            :player-id="id"
            :board="board"
          />
        </div>
      </div>
      <div class="p-2 bg-dark border-top border-secondary">
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
  <div class="card-footer bg-dark border-top border-secondary h5 p-2 m-0 d-flex">
    <span class="flex-fill badge badge-lg badge-secondary p-2">{{ statusMessage }} </span>
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
    statusMessage() {
      return this.$t('ui.game.messages.welcome');
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
  },
  beforeUnmount() {
    $('#setupConfirmationModal').modal('hide');
  },
});
</script>
