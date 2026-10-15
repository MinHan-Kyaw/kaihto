import { render, screen, within } from '@testing-library/react';

import { vowelGroups, vowels } from '../../data';

import AllVowels from '.';

describe('AllVowels', () => {
  it('shows the short, long and extra vowels in their own groups, without the standalone vowels', () => {
    render(<AllVowels />);

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
  });

  it('shows the vowel with its sound and Burmese pronunciation, without class examples or audio buttons', () => {
    render(<AllVowels />);

    const card = screen.getByRole('article', { name: '◌ิ' });

    expect(card).toHaveTextContent('◌ิ i အိ');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
