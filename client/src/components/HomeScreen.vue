<template>
<div class="container-fluid h-100 d-flex justify-content-center align-items-center">
  <div class="card p-4 text-center">
    <div class="form-group">
      <p>{{ $t('ui.homepage.intro_text') }}</p>
      <input
        class="btn btn-primary"
        type="button"
        @click="createRoom()"
        :value="$t('ui.homepage.create_room')"
        :disabled="creatingRoom"
      >
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { store } from '../store';

export default defineComponent({
  name: 'HomeScreen',
  data() {
    return {
      roomId: '',
      creatingRoom: false,
    };
  },
  methods: {
    createRoom() {
      this.creatingRoom = true;
      store.dispatch('createRoom').then((roomId) => {
        console.log(roomId);
        this.$router.push({ name: 'join-room', params: { roomId } });
        this.creatingRoom = false;
      }).catch((reason) => {
        console.error('error when creating room', reason);
        this.creatingRoom = false;
      });
    },
  },
});
</script>
