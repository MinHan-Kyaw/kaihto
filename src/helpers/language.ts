import type { Language } from '../i18n';
import type { Word } from '../types/learning';

export const getMeaning = (word: Pick<Word, 'meaning' | 'meaningEn'>, lang: Language) =>
  lang === 'en' ? word.meaningEn : word.meaning;

// A Meanings word may not have its Burmese pronunciation yet.
export const getPronunciation = (word: { pronunciation?: string; pronunciationEn: string }, lang: Language) =>
  lang === 'en' ? word.pronunciationEn : word.pronunciation;

// Learning content in the reader's language: Burmese takes the Myanmar font, English the page font.
export const getContentText = (lang: Language) =>
  lang === 'en' ? { lang: 'en', font: '' } : { lang: 'my', font: 'font-burmese' };
