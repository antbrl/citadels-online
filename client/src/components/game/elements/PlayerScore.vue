<template>
<div class="card bg-dark">
  <ul class="list-group list-group-flush text-dark shadow-sm overflow-auto">
    <li
      v-for="line, i in lines" :key="i"
      class="list-group-item list-group-item-dark p-2
        d-flex justify-content-between align-items-center"
    >
      <span class="badge text-wrap">{{ $t(`ui.score.${line.title}`) }}</span>
      <span class="badge badge-secondary shadow-sm">{{ line.value ?? 0 }}</span>
    </li>
  </ul>
  <ul class="list-group list-group-flush text-dark shadow-sm">
    <li class="list-group-item list-group-item-warning p-2 d-flex justify-content-between">
      <span class="badge">{{ $t('ui.score.total') }}</span>
      <span class="badge badge-warning p-1 shadow-sm">{{ score.total ?? 0 }}</span>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerScore',
  props: {
    score: {
      required: true,
    },
  },
  computed: {
    lines() {
      const lines = [{ title: 'base', value: this.score.base }];
      if (this.score.extraPointsStash) {
        lines.push({ title: 'extra_stash', value: this.score.extraPointsStash });
      }
      if (this.score.extraPointsHand) {
        lines.push({ title: 'extra_hand', value: this.score.extraPointsHand });
      }
      if (this.score.extraPointsDistrictTypes) {
        lines.push({ title: 'extra_district_types', value: this.score.extraPointsDistrictTypes });
      }
      if (this.score.extraPointsCompleteCity) {
        lines.push({ title: 'extra_complete_city', value: this.score.extraPointsCompleteCity });
      }
      return lines;
    },
  },
});
</script>
