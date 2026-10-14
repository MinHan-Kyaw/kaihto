import { assetUrl } from './assetUrl';

describe('assetUrl', () => {
  describe('given the app is served from the domain root', () => {
    it('keeps the path absolute', () => {
      expect(assetUrl('/images/words/kai.svg', '/')).toBe('/images/words/kai.svg');
    });
  });

  describe('given the app is served from a sub-path', () => {
    it('prefixes the base path', () => {
      expect(assetUrl('/images/words/kai.svg', '/kaihto/')).toBe('/kaihto/images/words/kai.svg');
    });
  });

  describe('given the asset path has no leading slash', () => {
    it('adds exactly one separator', () => {
      expect(assetUrl('audio/words/kai.m4a', '/kaihto/')).toBe('/kaihto/audio/words/kai.m4a');
    });
  });
});
