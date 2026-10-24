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
  it('reads Burmese from the /my prefix and English otherwise', () => {
    expect(getLanguageFromPath('/my', '/')).toBe('my');
    expect(getLanguageFromPath('/my/consonants/all', '/')).toBe('my');
    expect(getLanguageFromPath('/consonants', '/')).toBe('en');
    expect(getLanguageFromPath('/', '/')).toBe('en');
    expect(getLanguageFromPath('/myanmar', '/')).toBe('en');
  });

  describe('given the app is served from a sub-path', () => {
    it('reads the prefix after the base', () => {
      expect(getLanguageFromPath('/kaihto/my/vowels', '/kaihto/')).toBe('my');
      expect(getLanguageFromPath('/kaihto/vowels', '/kaihto/')).toBe('en');
      expect(getRouterBasename('my', '/kaihto/')).toBe('/kaihto/my');
    });
  });

  it('builds the same page in the other language', () => {
    expect(getPathInLanguage('/consonants?class=high', 'my', '/')).toBe('/my/consonants?class=high');
    expect(getPathInLanguage('/consonants?class=high', 'en', '/')).toBe('/consonants?class=high');
    expect(getPathInLanguage('/', 'my', '/')).toBe('/my/');
  });
});
