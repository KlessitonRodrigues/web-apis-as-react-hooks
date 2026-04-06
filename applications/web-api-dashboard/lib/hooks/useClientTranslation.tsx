import { COMMON } from '@packages/common-types';
import { getDefaultLanguage } from '@packages/daisy-ui-components';

import { getTranslation, translations } from './useServerTranslation';

export const useClientTranslations = () => {
  const lang = getDefaultLanguage() as COMMON.Language;
  const translation = translations[lang] || translations['en'];
  const translate = (key: string) => getTranslation(key, translation);
  return { lang, t: translate };
};
