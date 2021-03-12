<template>
  <form @submit.prevent="connect(username)">
    <label>Username: <input type="text" v-model="username" autofocus></label>
    <input type="submit" value="Connect">
  </form>
  <div>
    {{ isConnected ? 'connected' : 'disconnected' }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'CitadelsGame',
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
