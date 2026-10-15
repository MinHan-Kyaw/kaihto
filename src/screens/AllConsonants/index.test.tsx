import { render, screen, within } from '@testing-library/react';

import { consonantClasses, consonants } from '../../data';

import AllConsonants from '.';

describe('AllConsonants', () => {
  it('shows all 44 consonants as compact cards grouped by class', () => {
    render(<AllConsonants />);

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
  });

  it('shows the letter and Burmese meaning without the picture, Thai word or audio buttons', () => {
    render(<AllConsonants />);

    const card = screen.getByRole('article', { name: 'ก' });

    expect(card).toHaveTextContent('ကြက် (ကောကိုင်)');
    expect(within(card).queryByText('ไก่')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText('Picture coming soon')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
