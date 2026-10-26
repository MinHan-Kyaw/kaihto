import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';

import Layout from '.';

const onThemeChange = vi.fn();

const layoutAt = (route: string) => (
  <MemoryRouter initialEntries={[route]}>
    <Routes>
      <Route element={<Layout theme="light" onThemeChange={onThemeChange} />}>
        <Route path="*" element={<p>Screen content</p>} />
      </Route>
    </Routes>
  </MemoryRouter>
);

const renderLayout = (route: string) => render(layoutAt(route));

describe('Layout', () => {
  it('renders the brand link, main navigation and screen content', () => {
    renderLayout('/');

    expect(screen.getByRole('link', { name: 'Kai Hto' })).toHaveAttribute('href', '/');
    expect(within(screen.getByRole('link', { name: 'Kai Hto' })).getByRole('presentation')).toHaveAttribute(
      'src',
      '/favicon.svg'
    );
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Screen content');
    expect(
      within(screen.getByRole('list'))
        .getAllByRole('link')
        .map((link) => link.textContent)
    ).toEqual(['Consonants', 'Vowels', 'Tones', 'Meanings', 'Practice']);
  });

  it('opens and closes the phone menu with the menu button', async () => {
    renderLayout('/');

    const menuButton = screen.getByRole('button', { name: 'Menu' });

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', screen.getByRole('navigation', { name: 'Main' }).id);

    await userEvent.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  describe('given the phone menu is open', () => {
    it('closes when a page is chosen', async () => {
      renderLayout('/');
      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      await userEvent.click(screen.getByRole('link', { name: 'Vowels' }));

      expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes on Escape and returns focus to the menu button', async () => {
      renderLayout('/');
      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      await userEvent.keyboard('{Escape}');

      expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
    });

    it('closes on a tap outside the header', async () => {
      renderLayout('/');
      await userEvent.click(screen.getByRole('button', { name: 'Menu' }));

      await userEvent.click(screen.getByRole('main'));

      expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('switches to dark mode from the header', async () => {
    renderLayout('/');

    await userEvent.click(screen.getByRole('button', { name: 'Dark mode' }));

    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  describe('given the page is in English', () => {
    it('links to the same page in Burmese', () => {
      renderLayout('/consonants?class=high');

      const languageLink = screen.getByRole('link', { name: 'Read in Burmese' });

      expect(languageLink).toHaveAttribute('href', '/my/consonants?class=high');
      expect(languageLink).toHaveTextContent('မြန်မာ');
      expect(within(languageLink).getByText('မြန်မာ')).toHaveAttribute('lang', 'my');
    });
  });

  describe('given the page is in Burmese', () => {
    it('shows the navigation in Burmese and links to the same page in English', () => {
      render(inBurmese(layoutAt('/consonants/all')));

      expect(
        within(screen.getByRole('list'))
          .getAllByRole('link')
          .map((link) => link.textContent)
      ).toEqual(['ဗျည်း', 'သရ', 'အသံ', 'အဓိပ္ပာယ်', 'လေ့ကျင့်ရန်']);
      expect(screen.getByRole('link', { name: 'အင်္ဂလိပ်လို ဖတ်ရန်' })).toHaveAttribute('href', '/consonants/all');
    });
  });

  describe('given the current route matches a navigation item', () => {
    it('marks that item as the current page', () => {
      renderLayout('/practice');

      expect(screen.getByRole('link', { name: 'Practice' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: 'Consonants' })).not.toHaveAttribute('aria-current');
    });
  });
});
