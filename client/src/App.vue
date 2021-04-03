<template>
<header>
  <div class="container-lg">
    <div class="row align-items-center">
      <div class="col-2"></div>
      <div class="col text-center">
        <h6>{{ $t('ui.subtitle1') }}</h6>
        <h1><a href="/" class="text-reset">{{ $t('ui.title') }}</a></h1>
        <h6>{{ $t('ui.subtitle2') }}</h6>
      </div>
      <div class="col-2">
        <LocaleSelector class="opacity-4" />
      </div>
    </div>
  </div>
</header>
<div class="body">
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocaleSelector from './components/LocaleSelector.vue';

export default defineComponent({
  name: 'App',
  components: {
    LocaleSelector,
  },
});
</script>

<style lang="scss" scoped>
header {
  background: brown;
  color: wheat;
  margin: 0;
  padding: 0.5em;

  h1, h6 {
    padding: 0;
    margin: 0;
  }
}

.body {
  background: wheat;
  flex-grow: 1;
}
</style>
