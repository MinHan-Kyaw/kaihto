import { createContext, useCallback, useContext } from 'react';

import en from './en.yml';
import mm from './mm.yml';

// "my" is the ISO 639-1 code for Burmese, used for the HTML lang attribute; the file keeps the owner's name, mm.yml.
export type Language = 'en' | 'my';

export const DEFAULT_LANGUAGE: Language = 'en';

const BURMESE_PATH_SEGMENT = 'my';

type Messages = Record<string, string>;

const flatten = (tree: Record<string, unknown>, prefix = ''): Messages =>
  Object.entries(tree).reduce<Messages>((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') {
      return { ...flat, ...flatten(value as Record<string, unknown>, path) };
    }
    return { ...flat, [path]: String(value) };
  }, {});

export const messages: Record<Language, Messages> = { en: flatten(en), my: flatten(mm) };

export type TranslationValues = Record<string, string | number>;

export const translate = (lang: Language, key: string, values?: TranslationValues): string => {
  const message = messages[lang][key];
  if (message === undefined) {
    // Fail loudly in development and tests so a missing key is caught before it ships; show the key in production.
    if (import.meta.env.DEV) {
      throw new Error(`Missing ${lang} translation: ${key}`);
    }
    return key;
  }
  return values ? message.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match)) : message;
};

// Without a provider (most unit tests) the app reads English.
export const LanguageContext = createContext<Language>('en');

export const useTranslation = () => {
  const lang = useContext(LanguageContext);
  const t = useCallback((key: string, values?: TranslationValues) => translate(lang, key, values), [lang]);

  return { lang, t };
};

// Burmese pages live under /my; English, the default, has no prefix. `base` is Vite's BASE_URL and ends with "/".
export const getLanguageFromPath = (pathname: string, base: string): Language => {
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  return path === BURMESE_PATH_SEGMENT || path.startsWith(`${BURMESE_PATH_SEGMENT}/`) ? 'my' : DEFAULT_LANGUAGE;
};

export const getRouterBasename = (lang: Language, base: string) => (lang === 'my' ? `${base}${BURMESE_PATH_SEGMENT}` : base);

// `path` is the router location (pathname + search), relative to the current language's basename.
export const getPathInLanguage = (path: string, lang: Language, base: string) =>
  `${getRouterBasename(lang, base).replace(/\/$/, '')}${path}`;
