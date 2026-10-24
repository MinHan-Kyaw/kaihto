export type ConsonantClassId = 'middle' | 'high' | 'low';

// Names live in the translation files (src/i18n), keyed by id: classes.<id>.name and classes.<id>.shortName.
export interface ConsonantClass {
  id: ConsonantClassId;
  group: number;
  tone: ToneId; // the tone the class takes on a live syllable with no tone mark
  exampleConsonant: string;
  exampleSound: string; // English initial sound of exampleConsonant, e.g. "kh"
}

export interface Word {
  id: string;
  thai: string;
  pronunciation: string; // Burmese, from the owner
  meaning: string; // Burmese, from the owner
  meaningEn: string;
  pronunciationEn: string; // romanized letter name, e.g. "gor gai"
  image?: string;
  audio?: string;
}

export interface Consonant {
  id: string;
  character: string;
  class: ConsonantClassId;
  words: Word[];
}

// A word from the source's vocabulary chapter, shown on the meanings screen. Homographs get the English meaning in their
// id, e.g. "กา-kettle" and "กา-crow".
export interface MeaningWord {
  id: string; // the Thai word, e.g. "หู"
  thai: string;
  syllables: string[]; // the word split into open syllables, e.g. ["ภู", "เขา"]; each one's tone follows from its spelling
  meaning: string; // Burmese, from the source
  meaningEn: string;
  image: string;
  audio: string; // the Thai word said aloud
}

export interface VocabularyItem extends Word {
  consonant: string;
  consonantClass: ConsonantClassId;
}

export type AnswerMode = 'select' | 'class' | 'type' | 'speak';

export interface PracticeQuestion {
  id: string;
  answer: VocabularyItem;
  options: VocabularyItem[];
  mode: AnswerMode;
}

export type SyllableType = 'live' | 'dead';

export type ToneId = 'mid' | 'low' | 'falling' | 'high' | 'rising';

// Names live in the translation files: tones.<id>.name and tones.<id>.shortName.
export interface Tone {
  id: ToneId;
  thaiName: string;
  example: string; // a syllable said in this tone, from the kha set: คา ข่า ข้า ค้า ขา
  pitch: [number, number]; // start and end pitch, 1 (lowest) to 5 (highest)
  audio: string; // the example said in Thai, e.g. "/audio/tones/mid.m4a"
}

export interface ToneMark {
  mark: string;
  thaiName: string;
}

export type VowelGroupId = 'short' | 'long' | 'extra' | 'standalone';

// Names live in the translation files: vowelGroups.<id>.name and vowelGroups.<id>.shortName.
export interface VowelGroup {
  id: VowelGroupId;
  tones?: ToneId[]; // tone each consonant class takes, in class order, as the source states it; none where the source has none
}

export interface Vowel {
  id: string; // written with a dash for the consonant, e.g. "เ-ือะ"; standalone vowels have none
  group: VowelGroupId;
  sound: string; // English approximation, e.g. "eua"
  pronunciation: string; // Burmese pronunciation from the source, e.g. "အူရ"
  audio?: string; // Thai recitation of the vowel on อ, e.g. "อะ"
}

interface VowelQuestionBase {
  id: string; // the syllable
  consonant: Consonant;
  vowel: Vowel;
  syllable: string;
  tone: ToneId;
}

// sound: pick how the written vowel sounds; tone: pick the tone of the written syllable.
export type VowelQuestion = (VowelQuestionBase & { kind: 'sound'; options: Vowel[] }) | (VowelQuestionBase & { kind: 'tone' });

// The Thai names of live and dead syllables; their English and Burmese names and explanations are in src/i18n.
export interface Guide {
  syllables: Record<SyllableType, { thaiName: string }>;
}
