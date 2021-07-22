<template>
<div v-if="characters.length > 0" class="card bg-dark">
  <div v-if="title" class="card-header bg-secondary text-light text-center px-0">
    {{ title }}
  </div>
  <ul class="list-group list-group-flush text-dark shadow-sm">
    <li
      v-for="(character, i) in processedCharacters" :key="i"
      class="list-group-item p-2 d-flex justify-content-between"
      :class="{
        'list-group-item-dark': !character.killed,
        'list-group-item-danger': character.killed,
        'bg-secondary text-white-50': character.id < current || character.id === 0,
        'active bg-white text-dark border border-dark mx-n1 shadow-sm rounded':
          character.id === current && current !== 0 && !(killMode || robMode),
        'bg-light': character.id > current && !character.killed,
        'bg-white text-dark cursor-pointer': character.selectable,
      }"
      v-tooltip="$t(`characters.${character.id}.description`)"
      data-placement="left"
      @click="selectCharacter(i)"
    >
      <!-- unknown character id -->
      <span
        v-if="character.id === 0"
        class="badge badge-pill shadow-sm bg-dark text-light"
      >?</span>
      <!-- character id -->
      <span
        v-else
        class="badge badge-pill shadow-sm"
        :class="`bg-${bgColor(character.id)} text-${textColor(character.id)}`"
      >{{ character.id }}</span>
      <!-- character name -->
      <span
        class="badge text-truncate flex-fill text-left"
      >{{ $t(`characters.${character.id}.name`) }}</span>
      <!-- character state (killed or robbed) -->
      <span
        v-if="character.killed"
        class="badge badge-pill badge-danger p-1 shadow-sm"
      ><emoji emoji="💀"></emoji></span>
      <span
        v-else-if="character.robbed"
        class="badge badge-pill badge-dark p-1 shadow-sm"
      ><emoji emoji="💰"></emoji></span>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Move, MoveType } from '../../../types/gameTypes';
import { store } from '../../../store';

export default defineComponent({
  name: 'CharactersList',
  props: {
    title: {
      type: String,
      default: '',
    },
    characters: {
      type: Array,
      required: true,
    },
    current: {
      type: Number,
      default: 0,
    },
    killMode: {
      type: Boolean,
      default: false,
    },
    robMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    processedCharacters() {
      return this.characters.map((character) => ({
        selectable: (this.killMode && character.id > 1)
          || (this.robMode && character.id > 2 && !character.killed),
        ...character,
      }));
    },
  },
  methods: {
    bgColor(character: number) {
      if (character < this.current) {
        return 'dark';
      }
      switch (character) {
        case 4:
          return 'warning';
        case 5:
          return 'primary';
        case 6:
          return 'success';
        case 8:
          return 'danger';
        default:
          return 'secondary';
      }
    },
    textColor(character: number) {
      if (character < this.current) {
        return 'light';
      }
      switch (character) {
        case 4:
          return 'dark';
        default:
          return 'light';
      }
    },
    async selectCharacter(index: number) {
      if (!this.processedCharacters[index].selectable) return;

      let moveType = MoveType.CHOOSE_CHARACTER;

      if (this.killMode) {
        moveType = MoveType.ASSASSIN_KILL;
      } else if (this.robMode) {
        moveType = MoveType.THIEF_ROB;
      }

      const move: Move = { type: moveType, data: index };
      await store.dispatch('sendMove', move);
    },
  },
});
</script>
