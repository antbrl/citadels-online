<template>
<div
  class="district-card flex-shrink-0 rounded position-relative z-0"
  :class="{
    'district-card--selectable': !disabled && selectable,
    'district-card--selected': selected,
    'district-card--small': small,
  }"
  @click="toggleSelected()"
>
  <!-- face up -->
  <div
    v-if="data"
    class="card h-100 bg-black text-light shadow-sm overflow-hidden d-flex flex-column p-1"
    v-tooltip="$te(description) ? $t(description) : ''"
    :data-placement="small ? 'right' : 'top'"
  >

    <!-- card content -->
    <div :class="`flex-fill card-picture card-picture--${districtId} d-flex flex-column
      ${ disabled ? 'opacity-3' : '' }`">

      <!-- cost -->
      <div :class="{
        'gradient-black-transparent p-1': small,
        'gradient-transparent-black rotated-cost pt-3': !small,
      }">
        <div class="d-flex">
          <emoji v-for="i in data.cost" :key="i" class="coin" emoji="🪙"></emoji>
          <emoji v-for="i in data.extra_points" :key="i" class="coin grayscale" emoji="🪙"></emoji>
        </div>
      </div>

      <!-- body and description -->
      <div class="flex-fill"></div>
      <div v-if="!small" class="px-1" :class="{ 'pl-3': data.extra_points > 0 }">
        <div
          v-if="$te(description)"
          class="badge badge-light p-1 w-100 text-truncate opacity-4"
          style="left: 0; right: 0; bottom: 0;"
        >{{ $t(description) }}</div>
      </div>

      <!-- icon and name -->
      <div class="z-1 d-flex align-items-center gradient-transparent-black bg-black-alpha p-0">
        <span class="badge badge-pill p-1 shadow-sm align-self-end" :class="`bg-${color}`">
          <span class="badge badge-pill p-1 bg-dark">
            <emoji :emoji="icon"></emoji>
          </span>
        </span>
        <span
          class="title flex-fill text-center text-wrap"
        >{{ $t(name) }}</span>
      </div>
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
    small: {
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
  $cards: laboratory smithy library observatory graveyard imperial_treasury haunted_quarter map_room
    school_of_magic docks barracks watchtower monastery fortress cathedral manor tavern market
    trading_post prison temple castle harbor church dragon_gate great_wall palace university keep
    town_hall;

.district-card {
  height: 10rem;
  width: 7rem;

  &--small {
    height: 4rem;
  }

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
  filter: drop-shadow(-1px 0 2px rgba(0, 0, 0, .2));
  font-size: 75%;
  line-height: 1;

  &.grayscale {
    filter: grayscale(1);
  }

  &:last-child {
    min-width: initial;
  }
}

.rotated-cost {
  transform: rotate(90deg) translateY(-100%);
  transform-origin: top left;
  width: 9.5rem;
  padding-right: 2rem;

  .coin {
    transform: rotate(-90deg);

    &:last-child {
      min-width: 0;
    }
  }
}

.card-picture {
  background-position: center;
  background-size: cover;

  @each $card in $cards {
    &--#{$card} {
      background-image: url('../../../assets/cards/#{$card}.jpg');
    }
  }
}

.title {
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 3px black, 0 0 6px black;
}

.gradient-black-transparent {
  background-image: linear-gradient(to top,
    #00000000 0%,
    #00000009 30%,
    #00000022 50%,
    #00000055 70%,
    #00000077 80%,
    #000000bb 100%,
  );
}

.gradient-transparent-black {
  background-image: linear-gradient(
    #00000000 0%,
    #00000009 30%,
    #00000022 50%,
    #00000055 70%,
    #00000077 80%,
    #000000bb 100%,
  );
}

.bg-black-alpha {
  background-color: #0006;
}
</style>
