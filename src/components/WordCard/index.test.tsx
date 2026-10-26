import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';
import type { MeaningWord, Tone } from '../../types/learning';

import WordCard from '.';

const word: MeaningWord = {
  id: 'หู',
  thai: 'หู',
  syllables: ['หู'],
  meaning: 'နားရွက်',
  meaningEn: 'ear',
  pronunciationEn: 'huu',
  image: '/images/meanings/hu.svg',
  audio: '/audio/meanings/hu.m4a',
};

const risingTone: Tone = { id: 'rising', thaiName: 'เสียงจัตวา', example: 'ขา', pitch: [1, 4], audio: '/audio/tones/rising.m4a' };

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

  it('leaves out the pronunciation by default', () => {
    render(<WordCard word={word} />);

    expect(screen.queryByText('(huu)')).not.toBeInTheDocument();
  });

  describe('given the pronunciation is shown', () => {
    it('shows the romanized pronunciation in brackets after the meaning', () => {
      render(<WordCard word={word} showPronunciation />);

      expect(screen.getByText('ear').closest('p')).toHaveTextContent('ear (huu)');
      expect(screen.getByText('(huu)')).toHaveAttribute('lang', 'th-Latn');
    });

    describe('given the page is in Burmese', () => {
      // A placeholder, not the word's pronunciation.
      const BURMESE_PRONUNCIATION = 'ဗမာအသံထွက်';

      it('shows the Burmese pronunciation after the Burmese meaning', () => {
        render(inBurmese(<WordCard word={{ ...word, pronunciation: BURMESE_PRONUNCIATION }} showPronunciation />));

        const pronunciation = screen.getByText(`(${BURMESE_PRONUNCIATION})`);

        expect(screen.getByText('နားရွက်').closest('p')).toHaveTextContent(`နားရွက် (${BURMESE_PRONUNCIATION})`);
        expect(pronunciation).toHaveAttribute('lang', 'my');
        expect(pronunciation).toHaveClass('font-burmese');
      });

      describe('given the word has no Burmese pronunciation yet', () => {
        it('shows the meaning alone, without the romanization', () => {
          render(inBurmese(<WordCard word={word} showPronunciation />));

          expect(screen.getByText('နားရွက်').closest('p')).toHaveTextContent(/^နားရွက်$/);
        });
      });
    });
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

  describe('given the tones of its syllables', () => {
    it('shows each tone as its pitch curve, naming it for screen readers', () => {
      render(<WordCard word={word} tones={[{ syllable: 'หู', tone: risingTone }]} />);

      const tones = screen.getByText('Rising').closest('p');

      expect(screen.getByText('Rising')).toHaveClass('sr-only');

      expect(tones).toHaveTextContent('Tone Rising');
      expect(tones?.querySelector('svg')).toHaveAttribute('data-pitch', '14');
    });
  });

  describe('given no tones', () => {
    it('shows no tone', () => {
      render(<WordCard word={word} />);

      expect(screen.queryByText('Tone')).not.toBeInTheDocument();
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
