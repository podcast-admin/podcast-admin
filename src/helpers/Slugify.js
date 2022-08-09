import SlugifyCore from 'slugify';
import i18n from 'i18next';

const Slugify = (string, options = {}) => {
  return SlugifyCore(string, {
    lower: true,
    remove: /[{}[\]*+~.()'"!:@#,;§/?]/g,
    locale: i18n.language,
    ...options,
  });
};

export default Slugify;
