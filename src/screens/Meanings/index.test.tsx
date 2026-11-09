import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { meaningChapters, meanings } from '../../data';
import { playAudio } from '../../services/audio';
import { inBurmese } from '../../tests/fixtures';

import Meanings from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

const meaningsAt = (route: string) => (
  <MemoryRouter initialEntries={[route]}>
    <Routes>
      <Route path="meanings" element={<Meanings />} />
      <Route path="meanings/text" element={<Meanings showText />} />
    </Routes>
  </MemoryRouter>
);

const renderMeanings = (route = '/meanings') => render(meaningsAt(route));

const firstChapterWords = meaningChapters[0]?.words ?? [];

const toggleChapter = (name: RegExp) => userEvent.click(screen.getByRole('button', { name }));

describe('Meanings', () => {
  it('shows every word with its picture, meaning and audio in the source order once all chapters are open', async () => {
    renderMeanings();

    await toggleChapter(/^Chapter 5/);
    const cards = screen.getAllByRole('article');

    expect(cards.map((card) => card.getAttribute('aria-labelledby'))).toEqual(meanings.map((word) => `word-${word.id}`));
    expect(screen.getByRole('button', { name: /^Pictures/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('img')).toHaveLength(meanings.length);
    expect(screen.getAllByRole('button', { name: /^Play Thai audio/ })).toHaveLength(meanings.length);
    expect(cards[0]).toHaveTextContent('kettle');
    expect(cards[0]).not.toHaveTextContent('(gaa)');
    expect(within(cards[0] as HTMLElement).getByRole('img', { name: 'kettle' })).toBeInTheDocument();
  });

  it('shows the words under their chapter headings', () => {
    renderMeanings();

    expect(screen.getAllByRole('region').map((region) => region.getAttribute('aria-labelledby'))).toEqual([
      'meanings-chapter-3-title',
      'meanings-chapter-5-title',
    ]);
    expect(screen.getByRole('button', { name: 'Chapter 3 60 words' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chapter 5 20 words' })).toBeInTheDocument();
  });

  describe('given the chapters', () => {
    it('opens only the first chapter', () => {
      renderMeanings();

      expect(screen.getByRole('button', { name: /^Chapter 3/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: /^Chapter 5/ })).toHaveAttribute('aria-expanded', 'false');
      expect(within(screen.getByRole('region', { name: 'Chapter 3' })).getAllByRole('article')).toHaveLength(60);
      expect(within(screen.getByRole('region', { name: 'Chapter 5' })).queryAllByRole('article')).toHaveLength(0);
    });

    it('opens and closes a chapter with its heading', async () => {
      renderMeanings();

      await toggleChapter(/^Chapter 5/);

      expect(screen.getByRole('button', { name: /^Chapter 5/ })).toHaveAttribute('aria-expanded', 'true');
      expect(within(screen.getByRole('region', { name: 'Chapter 5' })).getAllByRole('article')).toHaveLength(20);

      await toggleChapter(/^Chapter 3/);

      expect(within(screen.getByRole('region', { name: 'Chapter 3' })).queryAllByRole('article')).toHaveLength(0);
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });

    it('keeps each chapter open or closed when switching tabs', async () => {
      vi.stubGlobal('scrollTo', vi.fn());
      renderMeanings();

      await toggleChapter(/^Chapter 5/);
      await toggleChapter(/^Chapter 3/);
      await userEvent.click(screen.getByRole('button', { name: /^Text/ }));

      expect(screen.getByRole('button', { name: /^Chapter 3/ })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });
  });

  it('plays the Thai audio for a word', async () => {
    renderMeanings();

    await userEvent.click(screen.getByRole('button', { name: 'Play Thai audio for หู' }));

    expect(playAudio).toHaveBeenCalledWith('/audio/meanings/hu.m4a');
  });

  it('shows the text cards with the Text tab and scrolls back to the top', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    renderMeanings();

    await userEvent.click(screen.getByRole('button', { name: /^Text/ }));

    expect(screen.getByRole('button', { name: /^Text/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(firstChapterWords.length);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  describe('given the text tab', () => {
    it('shows only the tone, Thai word and meaning on compact cards', () => {
      renderMeanings('/meanings/text');

      const cards = screen.getAllByRole('article');

      cards.forEach((card) => expect(card).toHaveAttribute('data-size', 'compact'));
      expect(screen.getByRole('article', { name: 'มือ' })).toHaveTextContent('hand (mue)');
      expect(screen.getByRole('article', { name: 'ภูเขา' })).toHaveTextContent('mountain (phuu-khao)');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Play Thai audio/ })).not.toBeInTheDocument();
    });

    it('shows the words under their chapter headings', async () => {
      renderMeanings('/meanings/text');
      await toggleChapter(/^Chapter 5/);

      expect(within(screen.getByRole('region', { name: 'Chapter 3' })).getAllByRole('article')).toHaveLength(60);
      expect(within(screen.getByRole('region', { name: 'Chapter 5' })).getAllByRole('article')).toHaveLength(20);
    });

    it('shows the tone of each syllable', () => {
      renderMeanings('/meanings/text');

      expect(screen.getByRole('article', { name: 'ภูเขา' })).toHaveTextContent('Tone Mid Rising');
      expect(screen.getByRole('article', { name: 'มะลิ' })).toHaveTextContent('Tone High High');
      expect(screen.getByRole('article', { name: 'ใจ' })).toHaveTextContent('Tone Mid');
    });

    describe('given words with tone marks', () => {
      it('shows the tone each mark gives', async () => {
        renderMeanings('/meanings/text');
        await toggleChapter(/^Chapter 5/);

        expect(screen.getByRole('article', { name: 'เก้าอี้' })).toHaveTextContent('Tone Falling Falling');
        expect(screen.getByRole('article', { name: 'ไก่' })).toHaveTextContent('Tone Low');
        expect(screen.getByRole('article', { name: 'โต๊ะ' })).toHaveTextContent('Tone High');
        expect(screen.getByRole('article', { name: 'ตั๋ว' })).toHaveTextContent('Tone Rising');
        expect(screen.getByRole('article', { name: 'เก้าอี้' })).toHaveTextContent('chair (gao-ii)');
      });
    });

    it('hides the pronunciation when Pronunciation is unticked', async () => {
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: 'Card options' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Pronunciation' }));

      expect(screen.getByRole('article', { name: 'มือ' })).not.toHaveTextContent('(mue)');
    });

    it('hides the tones when Tone is unticked', async () => {
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: 'Card options' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Tone' }));

      expect(screen.getByRole('article', { name: 'ภูเขา' })).not.toHaveTextContent('Rising');
    });

    it('hides the parts that are unticked, keeping at least one', async () => {
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: 'Card options' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Meaning' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Tone' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Pronunciation' }));

      expect(screen.getByRole('article', { name: 'มือ' })).not.toHaveTextContent('hand');
      expect(screen.getByRole('checkbox', { name: 'Thai' })).toBeDisabled();
    });

    it('goes back to the pictures with the Pictures tab', async () => {
      vi.stubGlobal('scrollTo', vi.fn());
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: /^Pictures/ }));

      expect(screen.getAllByRole('img')).toHaveLength(firstChapterWords.length);
    });
  });

  describe('given the page is in Burmese', () => {
    it('shows the tabs and meanings in Burmese', async () => {
      render(inBurmese(meaningsAt('/meanings/text')));
      await toggleChapter(/^အခန်း 5/);

      expect(screen.getByRole('button', { name: /^စာသား/ })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('region', { name: 'အခန်း 3' })).toBeInTheDocument();
      expect(screen.getByRole('article', { name: 'มือ' })).toHaveTextContent('အသံ အလယ်');
      expect(screen.getByRole('article', { name: 'มือ' })).toHaveTextContent('လက် (မူး)');
      expect(screen.getByRole('article', { name: 'ภูเขา' })).toHaveTextContent('တောင်တန်း (ဖူးခေါင်)');
      expect(screen.getByRole('button', { name: 'အခန်း 5 20 လုံး' })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('article', { name: 'เก้าอี้' })).toHaveTextContent('ကုလားထိုင် (ကောင့်အီ့)');
    });

    it('offers every part in the card options', async () => {
      render(inBurmese(meaningsAt('/meanings/text')));

      await userEvent.click(screen.getByRole('button', { name: 'ကတ် ရွေးချယ်စရာ' }));

      expect(screen.getAllByRole('checkbox').map((checkbox) => checkbox.closest('label')?.textContent)).toEqual([
        'ထိုင်း',
        'အသံ',
        'အဓိပ္ပာယ်',
        'အသံထွက်',
      ]);
    });
  });
});
