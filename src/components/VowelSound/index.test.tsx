import { render, screen } from '@testing-library/react';

import { inBurmese } from '../../tests/fixtures';

import VowelSound from '.';

describe('VowelSound', () => {
  it('shows the English sound in brackets', () => {
    const { container } = render(<VowelSound vowel={{ id: 'โ-', group: 'long', sound: 'oo', pronunciation: 'အိုး' }} />);

    expect(container).toHaveTextContent(/^\( oo \)$/);
  });

  describe('given the page is in Burmese', () => {
    it('shows the Burmese pronunciation, then the English sound, in brackets', () => {
      const { container } = render(
        inBurmese(<VowelSound vowel={{ id: 'โ-', group: 'long', sound: 'oo', pronunciation: 'အိုး' }} />)
      );

      expect(container).toHaveTextContent('( အိုး - oo )');
      expect(screen.getByText('အိုး')).toHaveAttribute('lang', 'my');
    });
  });
});
