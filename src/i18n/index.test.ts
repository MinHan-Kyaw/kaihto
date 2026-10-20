import { getLanguageFromPath, getPathInLanguage, getRouterBasename, messages, translate } from '.';

describe('messages', () => {
  it('has the same keys in English and Burmese', () => {
    expect(Object.keys(messages.my).sort()).toEqual(Object.keys(messages.en).sort());
  });

  it('has no empty text', () => {
    [...Object.values(messages.en), ...Object.values(messages.my)].forEach((message) => expect(message.trim()).not.toBe(''));
  });

  it('uses the same placeholders in both languages', () => {
    const placeholders = (message: string) => (message.match(/\{\w+\}/g) ?? []).sort();

    Object.entries(messages.en).forEach(([key, message]) => {
      expect({ key, placeholders: placeholders(messages.my[key] ?? '') }).toEqual({ key, placeholders: placeholders(message) });
    });
  });
});

describe('translate', () => {
  it('reads nested keys in each language', () => {
    expect(translate('en', 'nav.consonants')).toBe('Consonants');
    expect(translate('my', 'nav.consonants')).toBe('ဗျည်း');
  });

  it('fills in placeholders', () => {
    expect(translate('en', 'audio.play', { word: 'ไก่' })).toBe('Play Thai audio for ไก่');
  });

  describe('given a missing key', () => {
    it('throws in development and tests', () => {
      expect(() => translate('en', 'nope.missing')).toThrow('Missing en translation: nope.missing');
    });
  });
});

describe('language paths', () => {
  it('reads English from the /en prefix and Burmese otherwise', () => {
    expect(getLanguageFromPath('/en', '/')).toBe('en');
    expect(getLanguageFromPath('/en/consonants/all', '/')).toBe('en');
    expect(getLanguageFromPath('/consonants', '/')).toBe('my');
    expect(getLanguageFromPath('/', '/')).toBe('my');
    expect(getLanguageFromPath('/english', '/')).toBe('my');
  });

  describe('given the app is served from a sub-path', () => {
    it('reads the prefix after the base', () => {
      expect(getLanguageFromPath('/kaihto/en/vowels', '/kaihto/')).toBe('en');
      expect(getLanguageFromPath('/kaihto/vowels', '/kaihto/')).toBe('my');
      expect(getRouterBasename('en', '/kaihto/')).toBe('/kaihto/en');
    });
  });

  it('builds the same page in the other language', () => {
    expect(getPathInLanguage('/consonants?class=high', 'en', '/')).toBe('/en/consonants?class=high');
    expect(getPathInLanguage('/consonants?class=high', 'my', '/')).toBe('/consonants?class=high');
    expect(getPathInLanguage('/', 'en', '/')).toBe('/en/');
  });
});
