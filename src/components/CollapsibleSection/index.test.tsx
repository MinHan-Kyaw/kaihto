import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CollapsibleSection from '.';

const renderSection = ({ open = true, onToggle = vi.fn() } = {}) =>
  render(
    <CollapsibleSection id="chapter-5" title="Chapter 5" count={20} countLabel="words" open={open} onToggle={onToggle}>
      <p>Words of chapter 5</p>
    </CollapsibleSection>
  );

describe('CollapsibleSection', () => {
  it('names the section by its title and the heading button by its title and count', () => {
    renderSection();

    expect(screen.getByRole('region', { name: 'Chapter 5' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'Chapter 5 20 words' })).toBeInTheDocument();
  });

  it('shows the count without the count label on screen', () => {
    renderSection();

    expect(screen.getByText('words')).toHaveClass('sr-only');
  });

  describe('given it is open', () => {
    it('shows its content and marks the button expanded', () => {
      renderSection();

      expect(screen.getByRole('button', { name: /^Chapter 5/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Words of chapter 5')).toBeVisible();
    });
  });

  describe('given it is closed', () => {
    it('hides its content and marks the button collapsed', () => {
      renderSection({ open: false });

      expect(screen.getByRole('button', { name: /^Chapter 5/ })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('Words of chapter 5')).not.toBeVisible();
    });
  });

  it('points the button at the content it controls', () => {
    renderSection();

    const content = screen.getByText('Words of chapter 5').parentElement;

    expect(screen.getByRole('button', { name: /^Chapter 5/ })).toHaveAttribute('aria-controls', content?.id);
  });

  it('calls onToggle when the heading button is pressed', async () => {
    const onToggle = vi.fn();
    renderSection({ onToggle });

    await userEvent.click(screen.getByRole('button', { name: /^Chapter 5/ }));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
