import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vowelGroups, vowels } from '../../data';
import { playAudio } from '../../services/audio';

import Vowels from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

const renderVowels = (route = '/vowels') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="vowels" element={<Vowels />} />
        <Route path="vowels/overview" element={<Vowels showOverview />} />
      </Routes>
    </MemoryRouter>
  );

const rowCount = () => {
  const [, body] = within(screen.getByRole('table')).getAllByRole('rowgroup');
  return within(body as HTMLElement).getAllByRole('row').length;
};

describe('Vowels', () => {
  it('hides the page heading visually', () => {
    renderVowels();

    expect(screen.getByRole('heading', { level: 1, name: 'Thai Vowels' })).toHaveClass('sr-only');
  });

  it('shows the vowel group tabs with 12 / 12 / 4 / 4 vowels', () => {
    renderVowels();

    const tabs = within(screen.getByRole('list', { name: 'Vowel group' })).getAllByRole('button');

    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Short 12 vowels',
      'Long 12 vowels',
      'Extra 4 vowels',
      'Standalone 4 vowels',
    ]);
  });

  describe('given no group is chosen', () => {
    it('shows the short vowels', () => {
      renderVowels();

      expect(screen.getByRole('button', { name: /Short/ })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('heading', { name: 'Short vowels' })).toBeInTheDocument();
      expect(rowCount()).toBe(12);
    });
  });

  describe('given a group in the URL', () => {
    it('shows that group', () => {
      renderVowels('/vowels?group=extra');

      expect(screen.getByRole('heading', { name: 'Extra vowels' })).toBeInTheDocument();
      expect(rowCount()).toBe(4);
    });
  });

  it('switches group with the tabs', async () => {
    renderVowels();

    await userEvent.click(screen.getByRole('button', { name: /Long/ }));

    expect(screen.getByRole('heading', { name: 'Long vowels' })).toBeInTheDocument();
    expect(rowCount()).toBe(12);
  });

  it('shows each vowel with ก / ข / ค examples', () => {
    renderVowels();

    const cells = within(screen.getByRole('row', { name: /^1 -ะ/ })).getAllByRole('cell');

    expect(cells.slice(2).map((cell) => cell.textContent)).toEqual(['กะ ka', 'ขะ kha', 'คะ kha']);
  });

  it('plays the Thai audio for a vowel', async () => {
    renderVowels();

    await userEvent.click(screen.getByRole('button', { name: 'Play Thai audio for -ะ' }));

    expect(playAudio).toHaveBeenCalledWith('/audio/vowels/a.m4a');
  });

  it('shows the tone each consonant class takes', () => {
    renderVowels();

    const cells = within(screen.getByRole('row', { name: /^Tone/ })).getAllByRole('cell');

    expect(cells.map((cell) => cell.textContent)).toEqual(['Low', 'Low', 'High']);
  });

  it('hides the group heading visually', () => {
    renderVowels();

    expect(screen.getByRole('heading', { name: 'Short vowels' })).toHaveClass('sr-only');
  });

  describe('given the standalone vowels', () => {
    it('lists them as cards without examples or tones', () => {
      renderVowels('/vowels?group=standalone');

      expect(within(screen.getByRole('list', { name: 'Standalone vowels' })).getAllByRole('article')).toHaveLength(4);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('given all groups are shown', () => {
    it('shows the short, long and extra vowels in their own groups, without the standalone vowels', () => {
      renderVowels('/vowels/overview');

      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
        'Short vowels',
        'Long vowels',
        'Extra vowels',
      ]);
      vowelGroups
        .filter((group) => group.id !== 'standalone')
        .forEach((group) => {
          const cards = within(screen.getByRole('list', { name: group.name })).getAllByRole('article');

          expect(cards.map((card) => card.getAttribute('aria-labelledby'))).toEqual(
            vowels.filter((vowel) => vowel.group === group.id).map((vowel) => `vowel-${vowel.id}`)
          );
        });
      const cards = screen.getAllByRole('article');

      expect(cards).toHaveLength(28);
      cards.forEach((card) => expect(card).toHaveAttribute('data-size', 'large'));
      expect(screen.queryByRole('article', { name: 'ฤ' })).not.toBeInTheDocument();
      expect(screen.queryByRole('list', { name: 'Vowel group' })).not.toBeInTheDocument();
    });

    it('shows the vowel with its sound and Burmese pronunciation, without class examples or audio buttons', () => {
      renderVowels('/vowels/overview');

      expect(screen.getByRole('article', { name: '◌ิ' })).toHaveTextContent('◌ิ i အိ');
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Play Thai audio/ })).not.toBeInTheDocument();
    });

    it('goes back to the group tabs when the toggle is turned off', async () => {
      vi.stubGlobal('scrollTo', vi.fn());
      renderVowels('/vowels/overview');

      await userEvent.click(screen.getByRole('switch', { name: 'Overview' }));

      expect(screen.getByRole('heading', { name: 'Short vowels' })).toBeInTheDocument();
      expect(rowCount()).toBe(12);
    });
  });

  it('shows all groups when the toggle is turned on', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    renderVowels();

    expect(screen.getByRole('switch', { name: 'Overview' })).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(screen.getByRole('switch', { name: 'Overview' }));

    expect(screen.getAllByRole('article')).toHaveLength(28);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
