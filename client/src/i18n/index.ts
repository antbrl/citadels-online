import { createI18n } from 'vue-i18n';

import fr from './locale.fr.json';
import en from './locale.en.json';

export const messages = { fr, en };

export default createI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
  messages,
});
