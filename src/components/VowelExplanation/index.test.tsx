import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { VowelQuestion } from '../../types/learning';

import VowelExplanation from '.';

const question: VowelQuestion = {
  id: 'กะ',
  kind: 'tone',
  consonant: { id: 'ก', character: 'ก', class: 'middle', words: [] },
  vowel: { id: '-ะ', group: 'short', sound: 'a', pronunciation: 'အ' },
  syllable: 'กะ',
  tone: 'low',
};

const renderExplanation = (onPlay = vi.fn(), shown: VowelQuestion = question) =>
  render(
    <VowelExplanation
      question={shown}
      consonantClassName="အလယ်သံဗျည်းအုပ်စု"
      syllableName="Dead syllable"
      toneName="Low Tone"
      onPlay={onPlay}
    />
  );

describe('VowelExplanation', () => {
  it('explains how the class and syllable give the tone', () => {
    renderExplanation();

    expect(screen.getByText('Low Tone').closest('p')).toHaveTextContent('ก အလယ်သံဗျည်းအုပ်စု + -ะ Dead syllable → กะ Low Tone');
    expect(screen.getByText('အလယ်သံဗျည်းအုပ်စု')).toHaveAttribute('lang', 'my');
    expect(screen.getByText('กะ')).toHaveAttribute('lang', 'th');
  });

  it('plays the syllable', async () => {
    const onPlay = vi.fn();
    renderExplanation(onPlay);

    await userEvent.click(screen.getByRole('button', { name: 'Hear กะ' }));

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  describe('given a sound question', () => {
    const soundQuestion: VowelQuestion = { ...question, kind: 'sound', options: [question.vowel] };

    it('shows the vowel with its Burmese pronunciation and English sound', () => {
      renderExplanation(vi.fn(), soundQuestion);

      expect(screen.getByText('-ะ').closest('p')).toHaveTextContent('-ะ = ( အ - a )');
      expect(screen.getByText('အ')).toHaveAttribute('lang', 'my');
    });

    it('plays the vowel', async () => {
      const onPlay = vi.fn();
      renderExplanation(onPlay, soundQuestion);

      await userEvent.click(screen.getByRole('button', { name: 'Hear -ะ' }));

      expect(onPlay).toHaveBeenCalledTimes(1);
    });
  });
});
