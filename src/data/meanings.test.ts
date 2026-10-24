import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { meanings } from '.';

const THAI_TEXT = /^[\u0E00-\u0E7F]+$/;
const MYANMAR_SCRIPT = /^[\u1000-\u109F/]+$/;
const INVISIBLE_CHARACTERS = /[\u200B-\u200D\uFEFF]/;
const VISUAL_ORDER_VOWEL_SIGN_E = /(^|[^\u1000-\u109F])\u1031/;
const ENGLISH_MEANING = /^[a-z][a-z ]*$/;

const publicFileExists = (path: string) => existsSync(join(process.cwd(), 'public', path));

describe('meanings', () => {
  it('contains the 60 words of the source chapter', () => {
    expect(meanings).toHaveLength(60);
  });

  it('uses unique ids: the Thai word, with the English meaning added for words spelt alike', () => {
    expect(new Set(meanings.map((word) => word.id)).size).toBe(meanings.length);
    meanings.forEach((word) => {
      const isHomograph = meanings.filter((other) => other.thai === word.thai).length > 1;

      expect(word.id).toBe(isHomograph ? `${word.thai}-${word.meaningEn}` : word.thai);
    });
  });

  it('writes every word in Thai script, with sara am as one character', () => {
    meanings.forEach((word) => {
      expect(word.thai, word.id).toMatch(THAI_TEXT);
      expect(word.thai, word.id).not.toContain('\u0E4D\u0E32');
    });
  });

  it('gives every word a Burmese meaning in Unicode logical order', () => {
    meanings.forEach((word) => {
      expect(word.meaning, word.id).toMatch(MYANMAR_SCRIPT);
      expect(word.meaning, word.id).not.toMatch(INVISIBLE_CHARACTERS);
      expect(word.meaning, word.id).not.toMatch(VISUAL_ORDER_VOWEL_SIGN_E);
      expect(word.meaning, word.id).not.toContain('\u1040');
    });
  });

  it('gives every word an English meaning', () => {
    meanings.forEach((word) => expect(word.meaningEn, word.id).toMatch(ENGLISH_MEANING));
  });

  it('references an SVG image that exists for every word, a different one per word', () => {
    expect(new Set(meanings.map((word) => word.image)).size).toBe(meanings.length);
    meanings.forEach((word) => {
      expect(word.image, word.id).toMatch(/^\/images\/(meanings|words)\/[a-z-]+\.svg$/);
      expect(publicFileExists(word.image), word.image).toBe(true);
    });
  });

  it('keeps SVG images free of scripts, event handlers and external references', () => {
    meanings.forEach((word) => {
      const svg = readFileSync(join(process.cwd(), 'public', word.image), 'utf-8');

      expect(svg, word.image).toMatch(/^<svg[^>]*viewBox="0 0 32 32"/);
      expect(svg, word.image).not.toMatch(/<script|<foreignObject|<text|\son[a-z]+=|href="(?!#)/i);
    });
  });

  it('references audio that exists for every word, shared only by words spelt alike', () => {
    meanings.forEach((word) => {
      expect(word.audio, word.id).toMatch(/^\/audio\/meanings\/[a-z-]+\.m4a$/);
      expect(publicFileExists(word.audio), word.audio).toBe(true);
      meanings.filter((other) => other.audio === word.audio).forEach((other) => expect(other.thai, other.id).toBe(word.thai));
    });
  });
});
