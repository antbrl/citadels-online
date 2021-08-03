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
        <table class="table">
          <tbody>
            <tr>
              <td>{{ $t('ui.lobby.settings.complete_city_size') }}</td>
              <td>{{ gameSetupData.completeCitySize }}</td>
            </tr>
          </tbody>
        </table>
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
  <div class="row no-gutters h-100 overflow-auto">
    <div v-if="isManager" class="col p-3">
      <div class="form-group">
        <label for="completeCitySize">
          {{ $t('ui.lobby.settings.complete_city_size') }}
        </label>
        <select class="form-control" id="completeCitySize" v-model="completeCitySize">
          <option :value="7">7</option>
          <option :value="8">8</option>
        </select>
      </div>
    </div>
    <div class="col p-3 bg-light">
      <PlayersList />
    </div>
  </div>
  <div class="card-footer">
    <input
      type="button"
      class="btn btn-primary btn-lg btn-block"
      @click="showConfirmationModal"
      :disabled="validation.disabled"
      :value="validation.message"
    >
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { PlayerRole } from 'citadels-common';
import PlayersList from './elements/PlayersList.vue';
import { store } from '../../store';

export default defineComponent({
  components: { PlayersList },
  name: 'LobbyScreen',
  data() {
    return {
      startingGame: false,
      completeCitySize: 7,
    };
  },
  computed: {
    ...mapGetters([
      'getPlayerFromId',
      'gameSetupData',
      'gameState',
    ]),
    isManager() {
      return this.getPlayerFromId(this.gameState.self)?.manager || false;
    },
    validation() {
      // get players
      const playersCount = Array.from(this.gameState?.players.values() || [])
        .filter((player) => player.role === PlayerRole.PLAYER).length;

      // too many players
      if (playersCount > 7) {
        return {
          disabled: true,
          message: this.$t('ui.lobby.too_many_players'),
        };
      }

      // not enough players
      if (playersCount < 2) {
        return {
          disabled: true,
          message: this.$t('ui.lobby.not_enough_players'),
        };
      }

      // not a manager
      if (!this.isManager) {
        return {
          disabled: true,
          message: this.$t('ui.lobby.wait_message'),
        };
      }

      // pass all checks
      return {
        disabled: false,
        message: this.$t('ui.lobby.start_game'),
      };
    },
  },
  methods: {
    showConfirmationModal() {
      const settings = { completeCitySize: this.completeCitySize };
      store.commit('prepareGameSetupConfirmation', settings);
      $('#setupConfirmationModal').modal();
    },
    async startGame() {
      try {
        this.startingGame = true;
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
