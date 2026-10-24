// How far above the baseline a Thai word's ink reaches, in em, measured for Sarabun (font-thai). Most letters reach
// 0.59em; tall letters, the vowels written above a word and marks reach higher.
const BASE_INK_HEIGHT = 0.59;

const INK_HEIGHTS: Record<string, number> = {
  ฬ: 0.64,
  ป: 0.82,
  ฝ: 0.82,
  ฟ: 0.82,
  โ: 0.98,
  ใ: 0.99,
  ไ: 1,
  'ั': 0.92, // mai han-akat
  ำ: 0.9, // sara am
  'ิ': 0.9, // sara i
  'ี': 0.95, // sara ii
  'ึ': 0.95, // sara ue
  'ื': 0.95, // sara uee
  '็': 1.03, // mai taikhu
  '่': 0.9, // mai ek
  '้': 0.96, // mai tho
  '๊': 0.95, // mai tri
  '๋': 0.92, // mai chattawa
  '์': 0.98, // thanthakhat
  'ํ': 0.9, // nikhahit
};

// A tone mark stacked on a vowel above the consonant, as in กี่.
const STACKED_MARKS = /[ัิ-ื][่-๋]/;
const STACKED_INK_HEIGHT = 1.26;

export const getThaiInkHeight = (thai: string): number =>
  STACKED_MARKS.test(thai)
    ? STACKED_INK_HEIGHT
    : Math.max(BASE_INK_HEIGHT, ...[...thai].map((character) => INK_HEIGHTS[character] ?? 0));
