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
        <h5 class="modal-title" id="setupConfirmationModalLabel">
          {{ $t('ui.lobby.start_game') }}
        </h5>
        <button type="button" class="close" data-dismiss="modal" :aria-label="$t('ui.cancel')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card">
          <div class="card-header">{{ $t('ui.lobby.players') }}</div>
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
              >{{ $t('ui.lobby.you') }}</span>
              <span
                v-else-if="!getPlayerFromId(playerId).online"
                class="badge badge-secondary"
              >{{ $t('ui.lobby.offline') }}</span>
              <span
                v-else
                class="badge badge-success"
              >{{ $t('ui.lobby.online') }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          {{ $t('ui.cancel') }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="startGame"
          :disabled="startingGame"
        >{{ $t('ui.confirm') }}</button>
      </div>
    </div>
  </div>
</div>
<div class="card h-100">
  <div class="card-header">{{ $t('ui.lobby.title') }}</div>
  <div class="row no-gutters h-100">
    <div class="col p-3">
      <p class="text-muted">{{ $t('ui.lobby.no_settings') }}</p>
    </div>
    <div class="col-3 p-3 bg-light">
      <PlayersList />
    </div>
  </div>
  <div class="card-footer">
    <input
    type="button"
    class="btn btn-primary btn-lg btn-block"
    :value="$t('ui.lobby.start_game')"
    @click="showConfirmationModal"
  >
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import PlayersList from './elements/PlayersList.vue';
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
