<template>
<div class="lobby">
  <form @submit.prevent="connect(username)">
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        class="form-control"
        v-model="username"
        id="username"
        autofocus
        :disabled="isConnected"
      >
    </div>
    <div class="form-group">
      <input class="btn btn-primary" type="submit" value="Connect" :disabled="isConnected">
    </div>
  </form>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'LobbyScreen',
  data() {
    return {
      username: '',
    };
  },
  computed: {
    ...mapGetters([
      'isConnected',
    ]),
  },
  methods: {
    ...mapActions([
      'connect',
    ]),
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
