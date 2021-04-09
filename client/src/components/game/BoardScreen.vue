<template>
<div class="card h-100 bg-light">
  <div class="row no-gutters h-100">
    <div class="col p-3">
    </div>
    <div class="col-2 p-2 bg-white d-flex flex-column justify-content-between">
      <CharactersList
        :title="$t('ui.game.characters')"
        :characters="charactersList.callable"
        :current="charactersList.current"
      />
      <CharactersList :characters="charactersList.aside" />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { store } from '../../store';
import CharactersList from './elements/CharactersList.vue';

export default defineComponent({
  components: { CharactersList },
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
