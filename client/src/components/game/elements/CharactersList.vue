<template>
<div class="card bg-dark">
  <div v-if="title" class="card-header bg-dark text-light text-center">
    {{ title }}
  </div>
  <ul class="list-group list-group-flush text-dark shadow-sm">
    <li
      class="list-group-item p-2 d-flex justify-content-between"
      :class="{
        'list-group-item-danger': character.killed,
        'bg-secondary text-white-50': character.id < current || character.id === 0,
        'active bg-white text-dark border border-dark mx-n2 px-3 shadow rounded':
          character.id === current,
        'bg-light': character.id > current && !character.killed,
      }"
      v-for="(character, i) in characters"
      :key="i"
    >
      <span>
        <span
          v-if="character.id === 0"
          class="badge badge-pill shadow-sm bg-dark text-light"
        >?</span>
        <span
          v-else
          class="badge badge-pill shadow-sm"
          :class="`bg-${bgColor(character.id)} text-${textColor(character.id)}`"
        >{{ character.id }}</span>
        {{ $t(`characters.${character.id}.name`) }}
      </span>
      <span>
        <span
          v-if="character.killed"
          class="badge badge-pill badge-danger p-1 shadow-sm"
        >💀</span>
        <span
          v-else-if="character.stolen"
          class="badge badge-pill badge-dark p-1 shadow-sm"
        >💰</span>
      </span>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
      default: undefined,
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
  },
});
</script>
