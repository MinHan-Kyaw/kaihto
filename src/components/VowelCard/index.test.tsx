import { render, screen } from '@testing-library/react';

import VowelCard from '.';

describe('VowelCard', () => {
  it('shows the vowel with its English sound and Burmese pronunciation', () => {
    render(<VowelCard vowel={{ id: 'ฤ', group: 'standalone', sound: 'reu', pronunciation: 'ရူ' }} />);

    const card = screen.getByRole('article', { name: 'ฤ' });

    expect(card).toHaveTextContent('ฤ reu ရူ');
    expect(screen.getByRole('heading', { name: 'ฤ' })).toHaveAttribute('lang', 'th');
    expect(screen.getByText('ရူ')).toHaveAttribute('lang', 'my');
  });

  it('shows a vowel mark that sits on the consonant on a dotted circle', () => {
    render(<VowelCard vowel={{ id: '-ิ', group: 'short', sound: 'i', pronunciation: 'အိ' }} />);

    expect(screen.getByRole('heading', { name: '◌ิ' })).toBeInTheDocument();
  });

  it('uses the default size', () => {
    render(<VowelCard vowel={{ id: 'ฤ', group: 'standalone', sound: 'reu', pronunciation: 'ရူ' }} />);

    expect(screen.getByRole('article')).toHaveAttribute('data-size', 'default');
  });

  describe('given the large size', () => {
    it('shows the same content', () => {
      render(<VowelCard vowel={{ id: 'ฤ', group: 'standalone', sound: 'reu', pronunciation: 'ရူ' }} size="large" />);

      const card = screen.getByRole('article', { name: 'ฤ' });

      expect(card).toHaveAttribute('data-size', 'large');
      expect(card).toHaveTextContent('ฤ reu ရူ');
    });
  });

  describe('given the vowel is hidden', () => {
    it('keeps the vowel for screen readers only', () => {
      render(<VowelCard vowel={{ id: 'ฤ', group: 'standalone', sound: 'reu', pronunciation: 'ရူ' }} showVowel={false} />);

      expect(screen.getByRole('article', { name: 'ฤ' })).toHaveTextContent('reu ရူ');
      expect(screen.getByRole('heading', { name: 'ฤ' })).toHaveClass('sr-only');
    });
  });

  describe('given the sound and pronunciation are hidden', () => {
    it('shows only the vowel', () => {
      render(
        <VowelCard
          vowel={{ id: 'ฤ', group: 'standalone', sound: 'reu', pronunciation: 'ရူ' }}
          showSound={false}
          showPronunciation={false}
        />
      );

      expect(screen.getByRole('article', { name: 'ฤ' })).toHaveTextContent(/^ฤ\s*$/);
    });
  });
});
