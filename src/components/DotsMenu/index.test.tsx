import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DotsMenu from '.';

const renderMenu = () =>
  render(
    <DotsMenu label="Options">
      <p>Menu content</p>
    </DotsMenu>
  );

const getMenuButton = () => screen.getByRole('button', { name: 'Options' });

describe('DotsMenu', () => {
  it('starts closed', () => {
    renderMenu();

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
  });

  it('opens and closes with its button', async () => {
    renderMenu();

    await userEvent.click(getMenuButton());

    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Menu content')).toBeInTheDocument();

    await userEvent.click(getMenuButton());

    expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
  });

  describe('given the menu is open', () => {
    describe('given Escape is pressed', () => {
      it('closes the menu and returns focus to its button', async () => {
        renderMenu();
        await userEvent.click(getMenuButton());

        await userEvent.keyboard('{Escape}');

        expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false');
        expect(getMenuButton()).toHaveFocus();
        expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
      });
    });

    describe('given the learner taps outside', () => {
      it('closes the menu', async () => {
        renderMenu();
        await userEvent.click(getMenuButton());

        await userEvent.click(document.body);

        expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false');
      });
    });

    describe('given the learner taps inside', () => {
      it('stays open', async () => {
        renderMenu();
        await userEvent.click(getMenuButton());

        await userEvent.click(screen.getByText('Menu content'));

        expect(screen.getByText('Menu content')).toBeInTheDocument();
      });
    });
  });
});
