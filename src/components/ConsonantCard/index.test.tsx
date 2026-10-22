import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';
import type { Consonant } from '../../types/learning';

import ConsonantCard from '.';

const buildConsonant = (overrides: Partial<Consonant['words'][number]> = {}): Consonant => ({
  id: 'ก',
  character: 'ก',
  class: 'middle',
  words: [
    {
      id: 'ก-ไก่',
      thai: 'ไก่',
      pronunciation: 'ကောကိုင်',
      meaning: 'ကြက်',
      meaningEn: 'chicken',
      pronunciationEn: 'gor gai',
      image: '/images/words/kai.svg',
      audio: '/audio/words/kai.m4a',
      ...overrides,
    },
  ],
});

describe('ConsonantCard', () => {
  it('renders the consonant, word, image, meaning and pronunciation', () => {
    render(<ConsonantCard consonant={buildConsonant()} onPlayAudio={vi.fn()} />);

    expect(screen.getByRole('article', { name: 'ก' })).toBeInTheDocument();
    expect(screen.getByText('ไก่')).toBeInTheDocument();
    expect(screen.getByText('chicken').closest('p')).toHaveTextContent('chicken (gor gai)');
    expect(screen.getByRole('img', { name: 'chicken' })).toHaveAttribute('src', '/images/words/kai.svg');
  });

  describe('given the page is in Burmese', () => {
    it('shows the Burmese meaning and pronunciation in the Myanmar font', () => {
      render(inBurmese(<ConsonantCard consonant={buildConsonant()} onPlayAudio={vi.fn()} />));

      const content = screen.getByText('ကြက်').closest('p');

      expect(content).toHaveTextContent('ကြက် (ကောကိုင်)');
      expect(content).toHaveAttribute('lang', 'my');
      expect(content).toHaveClass('font-burmese');
      expect(screen.getByRole('img', { name: 'ကြက်' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ไก่ ကို ထိုင်းလို နားထောင်ရန်' })).toBeInTheDocument();
    });
  });

  it('plays the word audio when the audio button is pressed', async () => {
    const onPlayAudio = vi.fn();
    const consonant = buildConsonant();
    render(<ConsonantCard consonant={consonant} onPlayAudio={onPlayAudio} />);

    await userEvent.click(screen.getByRole('button', { name: 'Play Thai audio for ไก่' }));

    expect(onPlayAudio).toHaveBeenCalledWith(consonant.words[0]);
  });

  it('uses the default size', () => {
    render(<ConsonantCard consonant={buildConsonant()} onPlayAudio={vi.fn()} />);

    expect(screen.getByRole('article')).toHaveAttribute('data-size', 'default');
  });

  describe('given the compact size', () => {
    it('shows the same content', () => {
      render(<ConsonantCard consonant={buildConsonant()} onPlayAudio={vi.fn()} size="compact" />);

      expect(screen.getByRole('article', { name: 'ก' })).toHaveAttribute('data-size', 'compact');
      expect(screen.getByText('ไก่')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'chicken' })).toBeInTheDocument();
    });
  });

  describe('given the word has no image', () => {
    it('renders a placeholder instead of an image', () => {
      render(<ConsonantCard consonant={buildConsonant({ image: undefined })} onPlayAudio={vi.fn()} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('Picture coming soon')).toBeInTheDocument();
    });
  });

  describe('given the word is hidden', () => {
    it('shows the letter, picture, meaning and pronunciation only', () => {
      render(<ConsonantCard consonant={buildConsonant()} showWord={false} />);

      expect(screen.getByRole('article', { name: 'ก' })).toHaveTextContent('chicken (gor gai)');
      expect(screen.queryByText('ไก่')).not.toBeInTheDocument();
    });
  });

  describe('given the picture is hidden', () => {
    it('shows neither the picture nor the placeholder', () => {
      render(<ConsonantCard consonant={buildConsonant()} showPicture={false} />);

      expect(screen.getByRole('article', { name: 'ก' })).toHaveTextContent('chicken (gor gai)');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText('Picture coming soon')).not.toBeInTheDocument();
    });
  });

  describe('given the letter is hidden', () => {
    it('keeps the letter for screen readers only', () => {
      render(<ConsonantCard consonant={buildConsonant()} showLetter={false} />);

      expect(screen.getByRole('article', { name: 'ก' })).toHaveTextContent('chicken (gor gai)');
      expect(screen.getByRole('heading', { name: 'ก' })).toHaveClass('sr-only');
    });
  });

  describe('given the meaning is hidden', () => {
    it('shows the pronunciation without the meaning', () => {
      render(<ConsonantCard consonant={buildConsonant()} showMeaning={false} />);

      expect(screen.getByText('(gor gai)')).toBeInTheDocument();
      expect(screen.queryByText('chicken')).not.toBeInTheDocument();
    });
  });

  describe('given the pronunciation is hidden', () => {
    it('shows the meaning without the pronunciation', () => {
      render(<ConsonantCard consonant={buildConsonant()} showPronunciation={false} />);

      expect(screen.getByText('chicken')).toBeInTheDocument();
      expect(screen.queryByText('(gor gai)')).not.toBeInTheDocument();
    });
  });

  describe('given no audio handler', () => {
    it('does not render the audio button', () => {
      render(<ConsonantCard consonant={buildConsonant()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('given the word has no audio', () => {
    it('does not render the audio button', () => {
      render(<ConsonantCard consonant={buildConsonant({ audio: undefined })} onPlayAudio={vi.fn()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
