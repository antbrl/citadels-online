<template>
<div class="lobby">
  <div class="card p-4 text-center">
    <div class="form-group">
      <p>Create a new room</p>
      <input class="btn btn-primary" type="button" @click="createRoom()" value="Create a room">
    </div>
    <hr>
    <form @submit.prevent="joinRoom(filteredRoomId)" autocomplete="off">
      <div class="form-group">
        <p>Join a room</p>
        <input
          type="text"
          class="form-control"
          v-model="roomId"
          placeholder="Room ID"
          id="room-id"
          autofocus
        >
      </div>
      <div class="form-group">
        <input class="btn btn-primary" type="submit" value="Join room">
      </div>
    </form>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeScreen',
  data() {
    return {
      roomId: '',
    };
  },
  methods: {
    isRoomIdValid(roomId: string): boolean {
      if (!roomId) { return false; }
      return true;
    },
    createRoom() {
      this.$router.push({ name: 'create-room' });
    },
    joinRoom(roomId: string) {
      if (!this.isRoomIdValid(roomId)) { return; }
      this.$router.push({ name: 'join-room', params: { roomId } });
    },
  },
  computed: {
    filteredRoomId(): string {
      return this.roomId.trim();
    },
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
