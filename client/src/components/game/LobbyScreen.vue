<template>
<div
  class="modal fade"
  id="setupConfirmationModal"
  tabindex="-1"
  aria-labelledby="setupConfirmationModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="setupConfirmationModalLabel">Start Game</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card">
          <div class="card-header">Players</div>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{'text-muted': !getPlayerFromId(playerId).online}"
              v-for="playerId in gameSetupData.players"
              :key="playerId"
            >
              <span>{{ getPlayerFromId(playerId).username }}</span>
              <span
                v-if="playerId === gameState.self"
                class="badge badge-info"
              >You</span>
              <span
                v-else-if="!getPlayerFromId(playerId).online"
                class="badge badge-secondary"
              >Offline</span>
              <span
                v-else
                class="badge badge-success"
              >Online</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          @click="startGame"
          :disabled="startingGame"
        >Confirm</button>
      </div>
    </div>
  </div>
</div>
<div class="card h-100">
  <div class="card-header">Game Setup</div>
  <div class="row no-gutters h-100">
    <div class="col p-3">
      <p class="text-muted">No settings for now.</p>
    </div>
    <div class="col-3 p-3 bg-light">
      <PlayersList />
    </div>
  </div>
  <div class="card-footer">
    <input
    type="button"
    class="btn btn-primary btn-lg btn-block"
    value="Start Game"
    @click="showConfirmationModal"
  >
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import PlayersList from './PlayersList.vue';
import { store } from '../../store';

export default defineComponent({
  components: { PlayersList },
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
    ]),
  },
  methods: {
    showConfirmationModal() {
      store.commit('prepareGameSetupConfirmation');
      $('#setupConfirmationModal').modal();
    },
    startGame() {
      this.startingGame = true;
      console.log('start game', this.gameSetupData);
    },
  },
});
</script>
