import enLang from '@/public/i18n/en.json';
import ptLang from '@/public/i18n/pt.json';
import { NEXTJS } from '@packages/common-types';

export const translations: Record<string, typeof enLang> = {
  en: enLang,
  pt: ptLang,
};

export const getTranslation = (key: string, translation: typeof enLang) => {
  const keys = key.split('.');
  const getValue = (obj: any, key: string) => (obj ? obj[key] : undefined);
  const result = keys.reduce(getValue, translation) as string;
  return result || 'NO_TEXT';
};

export const useServerTranslations = async (props: NEXTJS.PageProps) => {
  const { lang } = await props.params;
  const translation = translations[lang] || translations['en'];
  const translate = (key: string) => getTranslation(key, translation);
  return { lang, t: translate };
};

export const generateStaticParams = () => {
  return [{ lang: 'en' }, { lang: 'pt' }];
};

export const setTranslationEnv = (lang: string) => {
  process.env.NEXT_PUBLIC_APP_LOCALE = lang;
};
