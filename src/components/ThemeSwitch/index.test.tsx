import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';

import ThemeSwitch from '.';

describe('ThemeSwitch', () => {
  describe('given the light theme', () => {
    it('shows a moon and switches to dark', async () => {
      const onChange = vi.fn();
      render(<ThemeSwitch theme="light" onChange={onChange} />);

      const button = screen.getByRole('button', { name: 'Dark mode' });

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button.querySelector('svg')).toHaveAttribute('data-icon', 'moon');

      await userEvent.click(button);

      expect(onChange).toHaveBeenCalledWith('dark');
    });
  });

  describe('given the dark theme', () => {
    it('shows a sun and switches to light', async () => {
      const onChange = vi.fn();
      render(<ThemeSwitch theme="dark" onChange={onChange} />);

      const button = screen.getByRole('button', { name: 'Dark mode' });

      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button.querySelector('svg')).toHaveAttribute('data-icon', 'sun');

      await userEvent.click(button);

      expect(onChange).toHaveBeenCalledWith('light');
    });
  });

  describe('given the page is in Burmese', () => {
    it('labels the switch in Burmese', () => {
      render(inBurmese(<ThemeSwitch theme="light" onChange={vi.fn()} />));

      expect(screen.getByRole('button', { name: 'အမှောင်ပုံစံ' })).toBeInTheDocument();
    });
  });
});
