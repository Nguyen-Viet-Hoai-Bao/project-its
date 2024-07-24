import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import path from 'path';

i18next
  .use(Backend)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    lng: 'en',
    debug: true,
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18next;
