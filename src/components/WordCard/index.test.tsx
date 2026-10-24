import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';
import type { MeaningWord } from '../../types/learning';

import WordCard from '.';

const word: MeaningWord = {
  id: 'หู',
  thai: 'หู',
  meaning: 'နားရွက်',
  meaningEn: 'ear',
  image: '/images/meanings/hu.svg',
  audio: '/audio/meanings/hu.m4a',
};

describe('WordCard', () => {
  it('renders the picture, Thai word and meaning', () => {
    render(<WordCard word={word} onPlayAudio={vi.fn()} />);

    expect(screen.getByRole('article', { name: 'หู' })).toHaveTextContent('ear');
    expect(screen.getByRole('heading', { name: 'หู' })).toHaveAttribute('lang', 'th');
    expect(screen.getByRole('img', { name: 'ear' })).toHaveAttribute('src', '/images/meanings/hu.svg');
    expect(screen.getByRole('article')).toHaveAttribute('data-size', 'default');
  });

  it('plays the word audio when the audio button is pressed', async () => {
    const onPlayAudio = vi.fn();
    render(<WordCard word={word} onPlayAudio={onPlayAudio} />);

    await userEvent.click(screen.getByRole('button', { name: 'Play Thai audio for หู' }));

    expect(onPlayAudio).toHaveBeenCalledWith(word);
  });

  describe('given no audio handler', () => {
    it('shows no audio button', () => {
      render(<WordCard word={word} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('given the compact size without the picture', () => {
    it('shows only the Thai word and meaning', () => {
      render(<WordCard word={word} size="compact" showPicture={false} />);

      expect(screen.getByRole('article')).toHaveAttribute('data-size', 'compact');
      expect(screen.getByRole('article', { name: 'หู' })).toHaveTextContent('ear');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('given the Thai word and meaning are hidden', () => {
    it('keeps the Thai word for screen readers only and leaves out the meaning', () => {
      render(<WordCard word={word} showThai={false} showMeaning={false} />);

      expect(screen.getByRole('heading', { name: 'หู' })).toHaveClass('sr-only');
      expect(screen.queryByText('ear')).not.toBeInTheDocument();
    });
  });

  describe('given the page is in Burmese', () => {
    it('shows the Burmese meaning in the Myanmar font', () => {
      render(inBurmese(<WordCard word={word} onPlayAudio={vi.fn()} />));

      const meaning = screen.getByText('နားရွက်');

      expect(meaning).toHaveAttribute('lang', 'my');
      expect(meaning).toHaveClass('font-burmese');
      expect(screen.getByRole('img', { name: 'နားရွက်' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'หู ကို ထိုင်းလို နားထောင်ရန်' })).toBeInTheDocument();
    });
  });
});
