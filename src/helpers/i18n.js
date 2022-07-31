import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationDE from '../locales/de.json';
import translationEN from '../locales/en.json';

const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',

    nsSeparator: false,
    keySeparator: false,
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
