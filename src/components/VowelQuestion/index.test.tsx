import { render, screen } from '@testing-library/react';

import type { Consonant, VowelQuestion as VowelQuestionType } from '../../types/learning';

import VowelQuestion from '.';

const consonant: Consonant = { id: 'ก', character: 'ก', class: 'middle', words: [] };

const soundVowel = { id: '-ิ', group: 'short', sound: 'i', pronunciation: 'အိ' } as const;

const soundQuestion: VowelQuestionType = {
  id: 'กิ',
  kind: 'sound',
  consonant,
  vowel: soundVowel,
  syllable: 'กิ',
  tone: 'low',
  options: [soundVowel, { id: '-ะ', group: 'short', sound: 'a', pronunciation: 'အ' }],
};

const toneQuestion: VowelQuestionType = {
  id: 'กา',
  kind: 'tone',
  consonant,
  vowel: { id: '-า', group: 'long', sound: 'aa', pronunciation: 'အား' },
  syllable: 'กา',
  tone: 'mid',
};

describe('VowelQuestion', () => {
  describe('given a sound question', () => {
    it('shows only the vowel, without its consonant, sound or pronunciation', () => {
      render(
        <VowelQuestion question={soundQuestion}>
          <p>Answer area</p>
        </VowelQuestion>
      );

      expect(screen.getByRole('heading', { name: 'What sound is this?' })).toBeInTheDocument();
      expect(screen.getByText('◌ิ')).toHaveAttribute('lang', 'th');
      expect(screen.queryByText('กิ')).not.toBeInTheDocument();
      expect(screen.queryByText(/อิ|\bi\b/)).not.toBeInTheDocument();
      expect(screen.getByText('Answer area')).toBeInTheDocument();
    });
  });

  describe('given a tone question', () => {
    it('shows the written syllable', () => {
      render(
        <VowelQuestion question={toneQuestion}>
          <p>Answer area</p>
        </VowelQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Which tone is this?' })).toBeInTheDocument();
      expect(screen.getByText('กา')).toHaveAttribute('lang', 'th');
    });
  });

  describe('given the question changes', () => {
    it('moves focus to the prompt for keyboard and screen reader users', () => {
      const { rerender } = render(
        <VowelQuestion question={soundQuestion}>
          <p>Answer area</p>
        </VowelQuestion>
      );

      expect(screen.getByRole('heading', { name: 'What sound is this?' })).not.toHaveFocus();

      rerender(
        <VowelQuestion question={toneQuestion}>
          <p>Answer area</p>
        </VowelQuestion>
      );

      expect(screen.getByRole('heading', { name: 'Which tone is this?' })).toHaveFocus();
    });
  });
});
