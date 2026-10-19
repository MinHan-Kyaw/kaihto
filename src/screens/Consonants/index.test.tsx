import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { consonantClasses, consonants } from '../../data';
import { playAudio } from '../../services/audio';

import Consonants from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

const renderConsonants = (route = '/consonants') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="consonants" element={<Consonants />} />
        <Route path="consonants/overview" element={<Consonants showOverview />} />
      </Routes>
    </MemoryRouter>
  );

const getCards = () => within(screen.getByRole('region', { name: /Class/ })).getAllByRole('article');

describe('Consonants', () => {
  it('shows the middle class by default', () => {
    renderConsonants();

    expect(screen.getByRole('heading', { level: 2, name: 'Middle Class' })).toBeInTheDocument();
    expect(getCards()).toHaveLength(9);
    expect(screen.getByRole('article', { name: 'ก' })).toHaveTextContent('ไก่');
    expect(screen.getByRole('article', { name: 'ก' })).toHaveTextContent('ကောကိုင်');
  });

  it('switches to the chosen class and scrolls back to its first letter', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    renderConsonants();

    await userEvent.click(screen.getByRole('button', { name: /^High/ }));

    expect(screen.getByRole('heading', { level: 2, name: 'High Class' })).toBeInTheDocument();
    expect(getCards()).toHaveLength(11);
    expect(screen.getByRole('article', { name: 'ข' })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  describe('given the selected class is chosen again', () => {
    it('stays where the learner is', async () => {
      const scrollTo = vi.fn();
      vi.stubGlobal('scrollTo', scrollTo);
      renderConsonants();

      await userEvent.click(screen.getByRole('button', { name: /^Middle/ }));

      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  it('plays the Thai audio for a word', async () => {
    renderConsonants();

    await userEvent.click(screen.getByRole('button', { name: 'Play Thai audio for ไก่' }));

    expect(playAudio).toHaveBeenCalledWith('/audio/words/kai.m4a');
  });

  describe('given the class is set in the URL', () => {
    it('shows that class', () => {
      renderConsonants('/consonants?class=low');

      expect(screen.getByRole('heading', { level: 2, name: 'Low Class' })).toBeInTheDocument();
      expect(getCards()).toHaveLength(24);
    });
  });

  describe('given an unknown class is set in the URL', () => {
    it('falls back to the middle class', () => {
      renderConsonants('/consonants?class=unknown');

      expect(screen.getByRole('heading', { level: 2, name: 'Middle Class' })).toBeInTheDocument();
    });
  });

  describe('given all classes are shown', () => {
    it('shows all 44 consonants as compact cards grouped by class', () => {
      renderConsonants('/consonants/overview');

      expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
        'Middle Class',
        'High Class',
        'Low Class',
      ]);
      consonantClasses.forEach((consonantClass) => {
        const cards = within(screen.getByRole('list', { name: consonantClass.name })).getAllByRole('article');

        expect(cards.map((card) => card.getAttribute('aria-labelledby'))).toEqual(
          consonants.filter((consonant) => consonant.class === consonantClass.id).map((consonant) => `consonant-${consonant.id}`)
        );
      });
      const cards = screen.getAllByRole('article');

      expect(cards).toHaveLength(44);
      cards.forEach((card) => expect(card).toHaveAttribute('data-size', 'compact'));
      expect(screen.queryByRole('list', { name: 'Consonant class' })).not.toBeInTheDocument();
    });

    it('shows the letter and Burmese meaning without the picture, Thai word or audio buttons', () => {
      renderConsonants('/consonants/overview');

      const card = screen.getByRole('article', { name: 'ก' });

      expect(card).toHaveTextContent('ကြက် (ကောကိုင်)');
      expect(within(card).queryByText('ไก่')).not.toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByText('Picture coming soon')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Play Thai audio/ })).not.toBeInTheDocument();
    });

    it('goes back to the class tabs when the toggle is turned off', async () => {
      vi.stubGlobal('scrollTo', vi.fn());
      renderConsonants('/consonants/overview');

      expect(screen.getByRole('switch', { name: 'Overview' })).toHaveAttribute('aria-checked', 'true');

      await userEvent.click(screen.getByRole('switch', { name: 'Overview' }));

      expect(screen.getByRole('heading', { level: 2, name: 'Middle Class' })).toBeInTheDocument();
      expect(getCards()).toHaveLength(9);
    });
  });

  it('shows all classes when the toggle is turned on', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    renderConsonants();

    expect(screen.getByRole('switch', { name: 'Overview' })).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(screen.getByRole('switch', { name: 'Overview' }));

    expect(screen.getAllByRole('article')).toHaveLength(44);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
