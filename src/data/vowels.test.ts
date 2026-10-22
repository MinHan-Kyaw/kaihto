import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { getUnmarkedTone } from '../helpers/tones';
import { getSyllable, isCombinable } from '../helpers/vowels';
import { messages } from '../i18n';
import type { Vowel } from '../types/learning';

import { consonantClasses, consonants, guide, toneMarks, tones, vowelGroups, vowels } from '.';

const THAI_TEXT = /^[\u0E00-\u0E7F]+$/;
const MYANMAR_SCRIPT = /^[\u1000-\u109F]+$/;
const INVISIBLE_CHARACTERS = /[\u200B-\u200D\uFEFF]/;
const VISUAL_ORDER_VOWEL_SIGN_E = /(^|[^\u1000-\u109F])\u1031/;

// Vowels whose Burmese pronunciation the source doesn't give yet; confirmed by the owner.
const PENDING_BURMESE_PRONUNCIATION: string[] = [];

describe('tones', () => {
  it('defines the five Thai tones', () => {
    expect(tones.map((tone) => tone.id)).toEqual(['mid', 'low', 'falling', 'high', 'rising']);
  });

  it('gives every tone an example syllable with audio that exists', () => {
    tones.forEach((tone) => {
      expect(tone.example).toMatch(THAI_TEXT);
      expect(tone.audio).toBe(`/audio/tones/${tone.id}.m4a`);
      expect(existsSync(join(process.cwd(), 'public', tone.audio)), tone.audio).toBe(true);
    });
  });

  it('gives every tone a name, Thai name and pitch from 1 to 5', () => {
    tones.forEach((tone) => {
      expect(messages.en[`tones.${tone.id}.name`]).toBeDefined();
      expect(messages.en[`tones.${tone.id}.shortName`]).toBeDefined();
      expect(tone.thaiName).toMatch(THAI_TEXT);
      tone.pitch.forEach((level) => expect(level).toBeGreaterThanOrEqual(1));
      tone.pitch.forEach((level) => expect(level).toBeLessThanOrEqual(5));
    });
  });

  it('defines the four tone marks', () => {
    expect(toneMarks.map((toneMark) => toneMark.mark)).toEqual(['่', '้', '๊', '๋']);
    toneMarks.forEach((toneMark) => expect(toneMark.thaiName).toMatch(THAI_TEXT));
  });

  it('matches each class tone to its live-syllable tone', () => {
    consonantClasses.forEach((consonantClass) => {
      expect(consonantClass.tone).toBe(getUnmarkedTone(consonantClass.id, 'live'));
    });
  });

  it('uses an example consonant from each class', () => {
    consonantClasses.forEach((consonantClass) => {
      const consonant = consonants.find((item) => item.character === consonantClass.exampleConsonant);

      expect(consonant?.class).toBe(consonantClass.id);
      expect(consonantClass.exampleSound).toMatch(/^[a-z]+$/);
    });
  });
});

describe('vowels', () => {
  it('contains 32 vowels split 12 / 12 / 4 / 4 across the groups', () => {
    const countByGroup = (groupId: string) => vowels.filter((vowel) => vowel.group === groupId).length;

    expect(vowelGroups.map((group) => group.id)).toEqual(['short', 'long', 'extra', 'standalone']);
    expect(vowels).toHaveLength(32);
    expect(vowelGroups.map((group) => countByGroup(group.id))).toEqual([12, 12, 4, 4]);
  });

  it('uses unique Thai ids', () => {
    expect(new Set(vowels.map((vowel) => vowel.id)).size).toBe(vowels.length);
    vowels.forEach((vowel) => expect(vowel.id).toMatch(/^[\u0E00-\u0E7F-]+$/));
  });

  it('writes combinable vowels with one dash for the consonant and standalone vowels without it', () => {
    vowels.forEach((vowel) => expect(vowel.id.split('-').length - 1, vowel.id).toBe(vowel.group === 'standalone' ? 0 : 1));
  });

  it('gives every vowel an English sound', () => {
    vowels.forEach((vowel) => expect(vowel.sound, vowel.id).toMatch(/^[a-z]+$/));
  });

  it('gives every vowel a Burmese pronunciation unless it is pending', () => {
    vowels
      .filter((vowel) => !PENDING_BURMESE_PRONUNCIATION.includes(vowel.id))
      .forEach((vowel) => expect(vowel.pronunciation, vowel.id).toMatch(MYANMAR_SCRIPT));
  });

  it('keeps the pending Burmese pronunciation list up to date', () => {
    const pending = vowels.filter((vowel) => !MYANMAR_SCRIPT.test(vowel.pronunciation)).map((vowel) => vowel.id);

    expect(pending).toEqual(PENDING_BURMESE_PRONUNCIATION);
  });

  it('stores Burmese pronunciation in Unicode logical order without invisible characters', () => {
    vowels.forEach((vowel) => {
      expect(vowel.pronunciation, vowel.id).not.toMatch(INVISIBLE_CHARACTERS);
      expect(vowel.pronunciation, vowel.id).not.toMatch(VISUAL_ORDER_VOWEL_SIGN_E);
    });
  });

  it('references audio that exists for every combinable vowel', () => {
    vowels.filter(isCombinable).forEach((vowel) => {
      expect(vowel.audio, vowel.id).toMatch(/^\/audio\/vowels\/[a-z-]+\.m4a$/);
      expect(existsSync(join(process.cwd(), 'public', vowel.audio as string)), vowel.audio).toBe(true);
    });
  });

  it('uses a different audio file for every vowel', () => {
    const audio = vowels.flatMap((vowel) => (vowel.audio ? [vowel.audio] : []));

    expect(new Set(audio).size).toBe(audio.length);
  });

  it('states one tone per consonant group for short and long vowels that matches the tone rules', () => {
    vowelGroups
      .filter((group) => group.tones)
      .forEach((group) => {
        const vowel = vowels.find((item) => item.group === group.id) as Vowel;

        expect(group.tones).toHaveLength(consonantClasses.length);
        consonantClasses.forEach((consonantClass, index) => {
          expect(group.tones?.[index], `${group.id} ${consonantClass.id}`).toBe(
            getUnmarkedTone(consonantClass.id, getSyllable(vowel))
          );
        });
      });
    expect(vowelGroups.filter((group) => group.tones).map((group) => group.id)).toEqual(['short', 'long']);
  });

  it('names every group in the translations', () => {
    vowelGroups.forEach((group) => {
      expect(messages.en[`vowelGroups.${group.id}.name`]).toBeDefined();
      expect(messages.en[`vowelGroups.${group.id}.shortName`]).toBeDefined();
    });
  });
});

describe('guide', () => {
  it('names and explains live and dead syllables in the translations', () => {
    Object.keys(guide.syllables).forEach((syllable) => {
      expect(messages.en[`syllables.${syllable}.name`]).toBeDefined();
      expect(messages.en[`syllables.${syllable}.detail`]).toBeDefined();
    });
  });

  it('gives the Thai terms for live and dead syllables', () => {
    expect(guide.syllables.live.thaiName).toBe('คำเป็น');
    expect(guide.syllables.dead.thaiName).toBe('คำตาย');
  });
});
