<template>
<div class="container-fluid d-flex justify-content-center align-items-center">
  <transition name="fade" mode="out-in">
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="error">
      {{ $t(errorMessage, { msg: errorReason }) }}
    </div>
    <div v-else-if="askForUsername">
      <form @submit.prevent="joinRoom" autocomplete="off">
        <div class="form-group">
          <label for="username">{{ $t('ui.room.username') }}</label>
          <input
            type="text"
            class="form-control"
            v-model="username"
            id="username"
            v-focus
          >
        </div>
        <div class="form-group">
          <input class="btn btn-primary" type="submit" :value="$t('ui.room.connect')">
        </div>
      </form>
    </div>
    <div v-else>
      {{ $t('ui.unknown_error') }}
    </div>
  </transition>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { RoomId } from 'citadels-common';
import { store } from '../../store';
import LoadingSpinner from './elements/LoadingSpinner.vue';

export default defineComponent({
  components: { LoadingSpinner },
  name: 'RoomEntryScreen',
  data() {
    return {
      username: '',
      loading: true,
      open: false,
      error: false,
      errorMessage: undefined,
      errorReason: undefined,
      askForUsername: false,
    };
  },
  computed: {
    ...mapGetters([
      'isConnected',
    ]),
    roomId() {
      return this.$route.params.roomId;
    },
  },
  methods: {
    ...mapActions([
      'connect',
    ]),
    async getRoomInfo(roomId: RoomId) {
      try {
        this.loading = true;
        this.open = false;
        const roomInfo = await store.dispatch('getRoomInfo', roomId);
        switch (roomInfo.status) {
          case 'open':
            this.open = true;
            break;
          case 'closed':
            this.open = false;
            break;
          case 'not found':
            this.errorMessage = 'ui.room.error_does_not_exist';
            this.error = true;
            break;
          default:
            console.log('get room info error:', roomInfo);
            this.errorMessage = 'ui.unknown_error';
            this.error = true;
        }
        if (this.error) {
          this.loading = false;
        } else if (localStorage.getItem(this.roomId)) {
          this.joinRoom();
        } else if (this.open) {
          this.askForUsername = true;
          this.loading = false;
        } else {
          this.errorMessage = 'ui.room.not_open';
          this.error = true;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    joinRoom() {
      this.loading = true;
      const playerId = localStorage.getItem(this.roomId);
      store.dispatch('joinRoom', { roomId: this.roomId, playerId, username: this.username }).catch((reason: Error) => {
        if (reason.message === 'game state is null') {
          this.getRoomInfo(this.roomId);
        } else {
          this.loading = false;
          this.error = true;
          this.errorMessage = 'ui.room.error_join';
          this.errorReason = reason.message;
        }
      });
    },
  },
  mounted() {
    this.getRoomInfo(this.roomId);
  },
});
</script>
