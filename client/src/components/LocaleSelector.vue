<template>
<div class="input-group">
  <div class="input-group-prepend">
    <label class="input-group-text px-2" for="inputGroupLocale">
      <emoji :emoji="$t('flag', $i18n.locale)"></emoji>
    </label>
  </div>
  <select class="custom-select" v-model="$i18n.locale" id="inputGroupLocale">
    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
      {{ $t('name', locale, locale) }}
    </option>
  </select>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { updateTitle } from '../i18n';

export default defineComponent({
  name: 'LocaleSelector',
  watch: {
    '$i18n.locale': {
      handler() {
        updateTitle();
      },
    },
  },
});
</script>
