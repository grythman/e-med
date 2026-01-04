import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mnTranslations from './locales/mn.json';
import enTranslations from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      mn: {
        translation: mnTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    lng: localStorage.getItem('language') || 'mn',
    fallbackLng: 'mn',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

