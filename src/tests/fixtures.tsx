import type { ReactNode } from 'react';

import { LanguageContext } from '../i18n';
import type { AnswerMode, PracticeQuestion, VocabularyItem } from '../types/learning';

export const buildVocabularyItem = (overrides: Partial<VocabularyItem> = {}): VocabularyItem => ({
  id: 'ก-ไก่',
  consonant: 'ก',
  consonantClass: 'middle',
  thai: 'ไก่',
  pronunciation: 'ကောကိုင်',
  meaning: 'ကြက်',
  meaningEn: 'chicken',
  pronunciationEn: 'gor gai',
  image: '/images/words/kai.svg',
  audio: '/audio/words/kai.m4a',
  ...overrides,
});

export const buildVocabulary = (): VocabularyItem[] => [
  buildVocabularyItem(),
  buildVocabularyItem({
    id: 'จ-จาน',
    consonant: 'จ',
    thai: 'จาน',
    pronunciation: 'ကျောကျန်း',
    meaning: 'ပန်းကန်ပြား',
    meaningEn: 'plate',
    pronunciationEn: 'jor jaan',
    image: '/images/words/chan.svg',
    audio: '/audio/words/chan.m4a',
  }),
  buildVocabularyItem({
    id: 'ป-ปลา',
    consonant: 'ป',
    thai: 'ปลา',
    pronunciation: 'ပေါပလား',
    meaning: 'ငါး',
    meaningEn: 'fish',
    pronunciationEn: 'bpor bplaa',
    image: '/images/words/pla.svg',
    audio: '/audio/words/pla.m4a',
  }),
  buildVocabularyItem({
    id: 'ด-เด็ก',
    consonant: 'ด',
    thai: 'เด็ก',
    pronunciation: 'ဒေါဒေ့',
    meaning: 'ကလေး',
    meaningEn: 'child',
    pronunciationEn: 'dor dek',
    image: '/images/words/dek.svg',
    audio: '/audio/words/dek.m4a',
  }),
];

export const buildQuestion = (answerIndex = 0, mode: AnswerMode = 'select'): PracticeQuestion => {
  const options = buildVocabulary().slice(0, 3);
  const answer = options[answerIndex] as VocabularyItem;

  return { id: answer.id, answer, options, mode };
};

// Renders in Burmese, the app's default; without it components read English (see src/i18n).
export const inBurmese = (ui: ReactNode) => <LanguageContext value="my">{ui}</LanguageContext>;
