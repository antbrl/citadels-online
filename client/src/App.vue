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
        <h6>{{ $t('ui.about.picture_credits') }}</h6>
        <ul>
          <li
            v-for="line, i in credits"
            :key="i"
          >
            <a :href="line[1]" target="_blank">{{ $t(`districts.${line[0]}.name`) }}</a>
            {{ $t('ui.about.by') }}
            <a v-if="line[3]" :href="line[3]" target="_blank">{{ line[2] }}</a>
            <span v-else>{{ line[2] }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<div class="d-flex flex-column h-100">
<header>
  <div class="container-fluid">
    <div class="d-flex flex-wrap align-items-center justify-content-end">
      <div class="flex-grow-1 text-center pb-1">
        <!-- <h6>{{ $t('ui.subtitle1') }}</h6> -->
        <h1><a href="/" class="text-reset">{{ $t('ui.title') }}</a></h1>
        <h6>{{ $t('ui.subtitle2') }}</h6>
      </div>
      <div class="text-right">
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
<div class="body flex-fill overflow-auto">
  <router-view></router-view>
</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LocaleSelector from './components/LocaleSelector.vue';
import credits from './data/credits.json';

export default defineComponent({
  name: 'App',
  components: {
    LocaleSelector,
  },
  computed: {
    credits() {
      return credits;
    },
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
}
</style>
