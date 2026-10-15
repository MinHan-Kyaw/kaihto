import { render, screen, within } from '@testing-library/react';

import { vowels } from '../../data';

import AllVowels from '.';

describe('AllVowels', () => {
  it('shows the short, long and extra vowels as cards in data order, without the standalone vowels', () => {
    render(<AllVowels />);

    const cards = within(screen.getByRole('list', { name: 'All Thai vowels' })).getAllByRole('article');
    const combinable = vowels.filter((vowel) => vowel.group !== 'standalone');

    expect(cards).toHaveLength(28);
    expect(cards.map((card) => card.getAttribute('aria-labelledby'))).toEqual(combinable.map((vowel) => `vowel-${vowel.id}`));
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
