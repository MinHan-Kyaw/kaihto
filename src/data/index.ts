import type {
  Consonant,
  ConsonantClass,
  Guide,
  MeaningChapter,
  Tone,
  ToneId,
  ToneMark,
  Vowel,
  VowelGroup,
} from '../types/learning';

import consonantClassesData from './consonantClasses.json';
import consonantsData from './consonants.json';
import guideData from './guide.json';
import meaningsData from './meanings.json';
import toneMarksData from './toneMarks.json';
import tonesData from './tones.json';
import vowelGroupsData from './vowelGroups.json';
import vowelsData from './vowels.json';

export const consonantClasses = consonantClassesData as ConsonantClass[];
export const consonants = consonantsData as Consonant[];
export const guide = guideData as Guide;
export const meaningChapters = meaningsData as MeaningChapter[];
// Every chapter's words, in chapter order.
export const meanings = meaningChapters.flatMap((chapter) => chapter.words);
export const tones = tonesData as Tone[];
export const toneMarks = toneMarksData as ToneMark[];
export const vowelGroups = vowelGroupsData as VowelGroup[];
export const vowels = vowelsData as Vowel[];

export const toneById = Object.fromEntries(tones.map((tone) => [tone.id, tone])) as Record<ToneId, Tone>;
