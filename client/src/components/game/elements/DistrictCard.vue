<template>
<div
  class="district-card flex-shrink-0 rounded"
  :class="{
    'district-card--selectable': !disabled && selectable,
    'opacity-3': disabled,
    'district-card--selected': selected,
  }"
  @click="toggleSelected()"
>
  <!-- face up -->
  <div
    v-if="data"
    class="card h-100 text-light shadow-sm overflow-hidden d-flex flex-column p-1"
    :class="`bg-${color}`"
    v-tooltip="$te(description) ? $t(description) : ''"
    data-placement="top"
  >
    <!-- cost -->
    <div class="card-header bg-dark p-1 py-2">
      <div class="badge p-0 d-flex">
        <emoji v-for="i in data.cost" :key="i" class="coin" emoji="🪙"></emoji>
        <emoji v-for="i in data.extra_points" :key="i" class="coin grayscale" emoji="🪙"></emoji>
      </div>
    </div>

    <!-- body and description -->
    <div
      class="flex-fill bg-dark text-light opacity-2
      d-flex justify-content-center align-items-center position-relative"
    >
      <div class="h1 m-0">
        <emoji :emoji="icon"></emoji>
      </div>
      <div
        v-if="$te(description)"
        class="badge badge-light m-1 p-1 position-absolute text-truncate"
        style="left: 0; right: 0; bottom: 0;"
      >{{ $t(description) }}</div>
    </div>

    <!-- icon and name -->
    <div class="card-footer bg-dark p-0 d-flex align-items-center">
      <span class="badge pl-1 pr-0 py-2"><emoji :emoji="icon"></emoji></span>
      <span
        class="badge mx-1 py-1 flex-fill text-center text-wrap"
      >{{ $t(name) }}</span>
    </div>
  </div>

  <!-- face down -->
  <div
    v-else
    class="card bg-secondary border-dark shadow-sm overflow-hidden h-100 w-100 p-1"
  >
    <div
      class="card bg-dark h-100 w-100
      d-flex justify-content-center align-items-center"
    >
      <span
        class="h1 m-0 opacity-2"
      ><emoji emoji="🏛"></emoji>️</span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'DistrictCard',
  props: {
    districtId: {
      type: String,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:selected'],
  computed: {
    ...mapGetters([
      'getDistrictFromId',
    ]),
    data() {
      return this.getDistrictFromId(this.districtId);
    },
    icon() {
      return {
        1: '👑',
        2: '💠',
        3: '💵',
        4: '⚔️',
        5: '🔮',
      }[this.data.type] || '❔';
    },
    color() {
      return {
        1: 'warning',
        2: 'primary',
        3: 'success',
        4: 'danger',
        5: 'purple',
      }[this.data.type] || 'white';
    },
    name() {
      return `districts.${this.districtId}.name`;
    },
    description() {
      return `districts.${this.districtId}.description`;
    },
  },
  methods: {
    toggleSelected() {
      this.$emit('update:selected', !this.selected && this.selectable);
    },
  },
});
</script>

<style lang="scss" scoped>
.district-card {
  height: 10rem;
  width: 7rem;

  &--selected {
    background: white;
    box-shadow: 0 0 0 3px white;
    filter: contrast(0.9) brightness(1.1);
  }

  &--selectable {
    cursor: pointer;

    &:hover {
      filter: contrast(0.9) brightness(1.1);
    }
  }
}

.coin {
  min-width: 0;
  text-shadow: -1px 0 2px rgba(0, 0, 0, .2);

  &.grayscale {
    filter: grayscale(1);
  }

  &:last-child {
    min-width: initial;
  }
}
</style>
