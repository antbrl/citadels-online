<template>
<div>
  <!-- face up -->
  <div
    v-if="data"
    class="district-card card text-light shadow-sm overflow-hidden d-flex flex-column p-1"
    :class="`bg-${color}`"
    v-tooltip
    data-placement="top"
    :title="$te(description) ? $t(description) : ''"
  >
    <!-- cost -->
    <div class="card-header bg-dark p-1 py-2">
      <div class="badge p-0 d-flex">
        <span v-for="i in data.cost" :key="i" class="coin">🪙</span>
        <span v-for="i in data.extra_points" :key="i" class="coin grayscale">🪙</span>
      </div>
    </div>

    <!-- body and description -->
    <div
      class="flex-fill bg-dark text-light opacity-2
      d-flex justify-content-center align-items-center position-relative"
    >
      <div class="h1 m-0">
        {{ icon }}
      </div>
      <div
        v-if="$te(description)"
        class="badge badge-light m-1 p-1 position-absolute text-truncate"
        style="left: 0; right: 0; bottom: 0;"
      >{{ $t(description) }}</div>
    </div>

    <!-- icon and name -->
    <div class="card-footer bg-dark p-0 d-flex align-items-center">
      <span class="badge pl-1 pr-0 py-2">{{ icon }}</span>
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
      >🏛️</span>
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
  },
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
});
</script>

<style lang="scss" scoped>
.district-card {
  height: 10em;
  width: 7em;
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
