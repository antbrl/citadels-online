<template>
<div class="lobby">
  <div v-if="loading">
    Loading...
  </div>
  <div v-else-if="error">
    {{ errorMessage }}
  </div>
  <div v-else-if="open">
    <form @submit.prevent="joinRoom">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          class="form-control"
          v-model="username"
          id="username"
          autofocus
        >
      </div>
      <div class="form-group">
        <input class="btn btn-primary" type="submit" value="Connect">
      </div>
    </form>
  </div>
  <div v-else>
    This room is not open for new players.
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { store } from '../../store';

export default defineComponent({
  name: 'LobbyScreen',
  data() {
    return {
      username: '',
      loading: false,
      open: false,
      error: false,
      errorMessage: undefined,
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
    getRoomInfo(roomId: string) {
      this.loading = true;
      this.open = false;
      store.dispatch('getRoomInfo', roomId).then((roomInfo) => {
        switch (roomInfo.status) {
          case 'open':
            this.open = true;
            break;
          case 'not found':
            this.errorMessage = 'This room does not exist.';
            this.error = true;
            break;
          default:
            console.log('get room info error:', roomInfo);
            this.errorMessage = 'Unknown error.';
            this.error = true;
        }
        this.loading = false;
      });
    },
    joinRoom() {
      this.loading = true;
      store.dispatch('joinRoom', { roomId: this.roomId, username: this.username }).catch((reason) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = `Error when joining the room: ${reason}`;
      });
    },
  },
  mounted() {
    this.getRoomInfo(this.roomId);
  },
});
</script>

<style lang="scss" scoped>
.lobby {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
