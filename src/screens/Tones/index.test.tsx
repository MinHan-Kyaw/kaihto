import { MemoryRouter } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { playAudio } from '../../services/audio';
import { inBurmese } from '../../tests/fixtures';

import Tones from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

const renderTones = () => render(<Tones />, { wrapper: MemoryRouter });

const getCell = (rowName: RegExp, column: number) =>
  within(screen.getByRole('row', { name: rowName })).getAllByRole('cell')[column] as HTMLElement;

describe('Tones', () => {
  it('lists the five tones with their Thai names', () => {
    renderTones();

    const items = within(screen.getByRole('list', { name: 'The five tones' })).getAllByRole('listitem');

    expect(items.map((item) => item.textContent)).toEqual([
      'Mid Tone เสียงสามัญ',
      'Low Tone เสียงเอก',
      'Falling Tone เสียงโท',
      'High Tone เสียงตรี',
      'Rising Tone เสียงจัตวา',
    ]);
  });

  it('plays each tone', async () => {
    renderTones();

    await userEvent.click(screen.getByRole('button', { name: 'Hear Rising Tone' }));

    expect(playAudio).toHaveBeenCalledWith('/audio/tones/rising.m4a');
  });

  it('shows the tone each group takes on a short and a long vowel', () => {
    renderTones();

    const table = screen.getByRole('table', { name: 'Short and long vowels' });

    expect(
      within(table)
        .getAllByRole('columnheader')
        .slice(1)
        .map((header) => header.textContent)
    ).toEqual(['Group 1 Middle ก', 'Group 2 High ข', 'Group 3 Low ค']);
    expect([0, 1, 2].map((column) => getCell(/^Short vowels/, column).textContent)).toEqual([
      'Low Tone',
      'Low Tone',
      'High Tone',
    ]);
    expect([0, 1, 2].map((column) => getCell(/^Long vowels/, column).textContent)).toEqual([
      'Mid Tone',
      'Rising Tone',
      'Mid Tone',
    ]);
    expect(screen.getByRole('rowheader', { name: /^Short vowels/ })).toHaveTextContent('Short vowels Dead syllable คำตาย');
    expect(screen.getByRole('rowheader', { name: /^Long vowels/ })).toHaveTextContent('Long vowels Live syllable คำเป็น');
  });

  it('shows the tone each mark gives and the marks a class does not use, in its own table', () => {
    renderTones();

    expect(within(screen.getByRole('table', { name: 'Tone marks' })).getAllByRole('row')).toHaveLength(5);

    expect(getCell(/ไม้เอก/, 2)).toHaveTextContent(/^Falling Tone$/);
    expect(getCell(/ไม้ตรี/, 0)).toHaveTextContent(/^High Tone$/);
    expect(getCell(/ไม้ตรี/, 1)).toHaveTextContent('Not used');
  });

  describe('given the page is in Burmese', () => {
    it('names the tones and explains the rules in Burmese, keeping the Thai terms', () => {
      render(inBurmese(<Tones />), { wrapper: MemoryRouter });

      expect(screen.getByRole('heading', { level: 1, name: 'ထိုင်းအသံများ' })).toBeInTheDocument();
      expect(within(screen.getByRole('list', { name: 'အသံ ငါးမျိုး' })).getAllByRole('listitem')[0]).toHaveTextContent(
        'အလယ်အသံ เสียงสามัญ'
      );
      expect(screen.getByRole('rowheader', { name: /^သရတိုများ/ })).toHaveTextContent('သရတိုများ အသေဝဏ္ဏ คำตาย');
      expect(screen.getByRole('table', { name: 'သရတိုနှင့် သရရှည်' })).toHaveTextContent('အုပ်စု 1');
    });
  });
});
