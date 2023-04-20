import i18n from 'i18next';
import SlugifyCore from 'slugify';

const Slugify = (string, options = {}) => {
  return SlugifyCore(string, {
    lower: true,
    remove: /[{}[\]*+~.()'"!:@#,;§/?]/g,
    locale: i18n.language,
    ...options,
  });
};

export default Slugify;
