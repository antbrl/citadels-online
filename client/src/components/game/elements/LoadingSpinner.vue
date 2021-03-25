<template>
<button type="button" class="btn btn-dark btn-lg text-light" disabled>
  <span class="spinner-border mr-2" role="status" aria-hidden="true"></span>
  <span class="align-top">Loading...</span>
</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingSpinner',
});
</script>
