import { getThaiInkHeight } from './thaiInk';

describe('getThaiInkHeight', () => {
  it('gives the letter height for words with nothing above the letters', () => {
    expect(getThaiInkHeight('ภูเขา')).toBe(0.59);
    expect(getThaiInkHeight('และ')).toBe(0.59);
  });

  it('gives the height of the tallest letter, vowel or mark', () => {
    expect(getThaiInkHeight('ปู')).toBe(0.82);
    expect(getThaiInkHeight('ดี')).toBe(0.95);
    expect(getThaiInkHeight('อะไร')).toBe(1);
    expect(getThaiInkHeight('ทำ')).toBe(0.9);
  });

  describe('given a tone mark stacked on a vowel above the consonant', () => {
    it('gives the height of the stack', () => {
      expect(getThaiInkHeight('กี่')).toBe(1.26);
    });
  });
});
