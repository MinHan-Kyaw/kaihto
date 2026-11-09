import { ANSWER_OPTION_COUNT, QUESTION_COUNT } from '../constants/practice';
import type { Consonant, SyllableType, ToneId, Vowel, VowelQuestion } from '../types/learning';

import { randomizeArray } from './randomizeArray';
import { getMarkedTone, getUnmarkedTone } from './tones';

const PLACEHOLDER = '-';

// ่ ้ ๊ ๋
const TONE_MARKS = /[\u0E48-\u0E4B]/g;

// Fonts can't stack a Thai mark on a dash, so a mark that sits on the consonant is shown on a dotted circle.
const MARK_ON_PLACEHOLDER = /-(?=[\u0E31\u0E33-\u0E3A\u0E47-\u0E4E])/;

export const getVowelLabel = (vowel: Vowel): string => vowel.id.replace(MARK_ON_PLACEHOLDER, '\u25CC');

export const isCombinable = (vowel: Vowel): boolean => vowel.group !== 'standalone';

export const combineVowel = (consonant: string, vowel: Vowel): string => vowel.id.replace(PLACEHOLDER, consonant);

export const getSyllable = (vowel: Vowel): SyllableType => (vowel.group === 'short' ? 'dead' : 'live');

export const getSyllableTone = (consonant: Pick<Consonant, 'class'>, vowel: Vowel): ToneId =>
  getUnmarkedTone(consonant.class, getSyllable(vowel));

// The consonant and vowel that spell an open syllable with no tone mark, e.g. "เขา" → ข + เ-า; undefined for any other.
export const findSyllable = (
  syllable: string,
  consonants: readonly Consonant[],
  vowels: readonly Vowel[]
): { consonant: Consonant; vowel: Vowel } | undefined =>
  vowels
    .filter(isCombinable)
    .flatMap((vowel) =>
      consonants
        .filter((consonant) => combineVowel(consonant.character, vowel) === syllable)
        .map((consonant) => ({ consonant, vowel }))
    )
    .at(0);

// The tone of an open syllable with at most one tone mark, from its consonant's class and its vowel's length or its mark,
// e.g. "เขา" → rising, "เก้า" → falling; undefined for any other text or a mark the consonant's class doesn't take.
export const findSyllableTone = (
  syllable: string,
  consonants: readonly Consonant[],
  vowels: readonly Vowel[]
): ToneId | undefined => {
  const marks = syllable.match(TONE_MARKS) ?? [];
  const spelling = findSyllable(syllable.replace(TONE_MARKS, ''), consonants, vowels);

  if (!spelling || marks.length > 1) {
    return undefined;
  }

  return marks[0] ? getMarkedTone(spelling.consonant.class, marks[0]) : getSyllableTone(spelling.consonant, spelling.vowel);
};

export const generateVowelQuestions = (
  consonants: readonly Consonant[],
  vowels: readonly Vowel[],
  { questionCount = QUESTION_COUNT, optionCount = ANSWER_OPTION_COUNT, random = Math.random } = {}
): VowelQuestion[] => {
  const combinable = vowels.filter(isCombinable);
  // ใ- and ไ- share a sound, so only one vowel per sound can be offered as an option.
  const bySound = combinable.filter((vowel, index) => combinable.findIndex((other) => other.sound === vowel.sound) === index);
  const pairs = consonants.flatMap((consonant) => combinable.map((vowel) => ({ consonant, vowel })));
  const soundAsked = new Set<string>();

  return randomizeArray(pairs, random)
    .slice(0, questionCount)
    .map(({ consonant, vowel }): VowelQuestion => {
      const syllable = combineVowel(consonant.character, vowel);
      const base = { id: syllable, consonant, vowel, syllable, tone: getSyllableTone(consonant, vowel) };

      // A sound question shows only the vowel, so each vowel is asked at most once that way.
      if (random() < 0.5 || soundAsked.has(vowel.id)) {
        return { ...base, kind: 'tone' };
      }
      soundAsked.add(vowel.id);
      const distractors = randomizeArray(
        bySound.filter((other) => other.sound !== vowel.sound),
        random
      ).slice(0, optionCount - 1);

      return { ...base, kind: 'sound', options: randomizeArray([vowel, ...distractors], random) };
    });
};

export const getVowelAnswer = (question: VowelQuestion): string =>
  question.kind === 'sound' ? question.vowel.id : question.tone;
