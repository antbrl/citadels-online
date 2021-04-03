<template>
<div class="input-group">
  <div class="input-group-prepend">
    <label class="input-group-text px-2" for="inputGroupLocale">
      <img
        :src="`/flags/${$t('flag', $i18n.locale)}.svg`"
        :alt="$i18n.locale"
      >
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

export default defineComponent({
  name: 'LocaleSelector',
});
</script>

<style lang="scss" scoped>
img {
  height: 1em;
}
</style>
