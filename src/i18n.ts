import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sena_i18n_lang') || 'es' : 'es';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
