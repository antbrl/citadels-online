import { createI18n } from 'vue-i18n';

import fr from './locale.fr.json';
import en from './locale.en.json';

export const messages = { fr, en };

const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages,
  warnHtmlInMessage: 'off',
});

export function updateTitle() {
  document.title = i18n.global.t('ui.title');
}

export default i18n;
