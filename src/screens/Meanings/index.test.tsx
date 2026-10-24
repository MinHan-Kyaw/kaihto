import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { meanings } from '../../data';
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

describe('Meanings', () => {
  it('shows every word with its picture, meaning and audio in the source order', () => {
    renderMeanings();

    const cards = screen.getAllByRole('article');

    expect(cards.map((card) => card.getAttribute('aria-labelledby'))).toEqual(meanings.map((word) => `word-${word.id}`));
    expect(screen.getByRole('button', { name: /^Pictures/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('img')).toHaveLength(60);
    expect(screen.getAllByRole('button', { name: /^Play Thai audio/ })).toHaveLength(60);
    expect(cards[0]).toHaveTextContent('kettle');
    expect(within(cards[0] as HTMLElement).getByRole('img', { name: 'kettle' })).toBeInTheDocument();
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
    expect(screen.getAllByRole('article')).toHaveLength(60);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  describe('given the text tab', () => {
    it('shows only the Thai word and meaning on compact cards', () => {
      renderMeanings('/meanings/text');

      const cards = screen.getAllByRole('article');

      cards.forEach((card) => expect(card).toHaveAttribute('data-size', 'compact'));
      expect(screen.getByRole('article', { name: 'มือ' })).toHaveTextContent('hand');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Play Thai audio/ })).not.toBeInTheDocument();
    });

    it('hides the parts that are unticked, keeping at least one', async () => {
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: 'Card options' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Meaning' }));

      expect(screen.getByRole('article', { name: 'มือ' })).not.toHaveTextContent('hand');
      expect(screen.getByRole('checkbox', { name: 'Thai' })).toBeDisabled();
    });

    it('goes back to the pictures with the Pictures tab', async () => {
      vi.stubGlobal('scrollTo', vi.fn());
      renderMeanings('/meanings/text');

      await userEvent.click(screen.getByRole('button', { name: /^Pictures/ }));

      expect(screen.getAllByRole('img')).toHaveLength(60);
    });
  });

  describe('given the page is in Burmese', () => {
    it('shows the tabs and meanings in Burmese', () => {
      render(inBurmese(meaningsAt('/meanings/text')));

      expect(screen.getByRole('button', { name: /^စာသား/ })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('article', { name: 'มือ' })).toHaveTextContent('လက်');
    });
  });
});
