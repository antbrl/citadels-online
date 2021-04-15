<template>
<div
  class="modal fade"
  id="aboutModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{ $t('ui.about.title') }}</h5>
        <button type="button" class="close" data-dismiss="modal" :aria-label="$t('ui.close')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p v-html="$t('ui.about.text')"></p>
      </div>
    </div>
  </div>
</div>
<div class="d-flex flex-column h-100">
<header>
  <div class="container-lg">
    <div class="row align-items-center">
      <div class="col-2"></div>
      <div class="col text-center">
        <h6>{{ $t('ui.subtitle1') }}</h6>
        <h1><a href="/" class="text-reset">{{ $t('ui.title') }}</a></h1>
        <h6>{{ $t('ui.subtitle2') }}</h6>
      </div>
      <div class="col-2 text-right">
        <LocaleSelector class="opacity-4" />
        <a
          class="text-reset text-decoration-none"
          href="#"
          data-toggle="modal"
          data-target="#aboutModal"
        >{{ $t('ui.about.title') }}</a>
      </div>
    </div>
  </div>
</header>
<div class="body flex-fill overflow-hidden">
  <router-view></router-view>
</div>
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
