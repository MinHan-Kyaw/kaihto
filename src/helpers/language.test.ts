import { getContentText, getMeaning, getPronunciation } from './language';

const word = { meaning: 'ကြက်', meaningEn: 'chicken', pronunciation: 'ကောကိုင်', pronunciationEn: 'gor gai' };

describe('getMeaning', () => {
  it('gives the meaning in the reader’s language', () => {
    expect(getMeaning(word, 'my')).toBe('ကြက်');
    expect(getMeaning(word, 'en')).toBe('chicken');
  });
});

describe('getPronunciation', () => {
  it('gives the Burmese pronunciation or the romanized letter name', () => {
    expect(getPronunciation(word, 'my')).toBe('ကောကိုင်');
    expect(getPronunciation(word, 'en')).toBe('gor gai');
  });
});

describe('getContentText', () => {
  it('marks Burmese content with its language and the Myanmar font', () => {
    expect(getContentText('my')).toEqual({ lang: 'my', font: 'font-burmese' });
    expect(getContentText('en')).toEqual({ lang: 'en', font: '' });
  });
});
