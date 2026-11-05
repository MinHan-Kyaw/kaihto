import { MemoryRouter, Route, Routes } from 'react-router';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { playAudio } from '../../services/audio';
import { inBurmese } from '../../tests/fixtures';

import Tones from '.';

vi.mock('../../services/audio', () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

const renderTones = () => render(<Tones />, { wrapper: MemoryRouter });
const renderToneMarks = () => render(<Tones showMarks />, { wrapper: MemoryRouter });

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

  it('shows the Tones and Tone marks tabs with their counts, Tones selected', () => {
    renderTones();

    expect(screen.getByRole('button', { name: 'Tones 5 tones' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Tone marks 4 tone marks' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByRole('table', { name: 'Tone marks on each group' })).not.toBeInTheDocument();
  });

  it('opens the Tone marks tab at its own address, from the top of the page', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    render(
      <MemoryRouter initialEntries={['/tones']}>
        <Routes>
          <Route path="tones" element={<Tones />} />
          <Route path="tones/marks" element={<Tones showMarks />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /^Tone marks/ }));

    expect(screen.getByRole('button', { name: /^Tone marks/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'The four tone marks' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'The five tones' })).not.toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    vi.unstubAllGlobals();
  });

  describe('given the Tone marks tab', () => {
    it('shows กา with no mark and with each of the four marks, in the five tones, as the source does', () => {
      renderToneMarks();

      const items = within(screen.getByRole('list', { name: 'One syllable with each tone mark' })).getAllByRole('listitem');

      expect(items.map((item) => item.textContent)).toEqual([
        'No mark กา Mid Tone',
        '◌่ไม้เอก mai-ek ก่า Low Tone',
        '◌้ไม้โท mai-tho ก้า Falling Tone',
        '◌๊ไม้ตรี mai-dtrii ก๊า High Tone',
        '◌๋ไม้จัตวา mai-jat-dta-waa ก๋า Rising Tone',
      ]);
      expect(items.map((item) => item.dataset.tone)).toEqual(['mid', 'low', 'falling', 'high', 'rising']);
    });

    it('plays each syllable', async () => {
      renderToneMarks();

      await userEvent.click(screen.getByRole('button', { name: 'Hear ก๋า' }));
      expect(playAudio).toHaveBeenLastCalledWith('/audio/tone-marks/gaa-rising.m4a');

      await userEvent.click(screen.getByRole('button', { name: 'Hear กา' }));
      expect(playAudio).toHaveBeenLastCalledWith('/audio/tone-marks/gaa-mid.m4a');
    });

    it('marks the Thai text as Thai', () => {
      renderToneMarks();

      expect(screen.getByText('ไม้จัตวา')).toHaveAttribute('lang', 'th');
      expect(screen.getByText('ก๋า')).toHaveAttribute('lang', 'th');
    });
  });

  it('shows the tone each mark gives and the marks a class does not use, in its own table', () => {
    renderToneMarks();

    expect(within(screen.getByRole('table', { name: 'Tone marks on each group' })).getAllByRole('row')).toHaveLength(5);

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

    it('gives the tone mark names a Burmese pronunciation', () => {
      render(inBurmese(<Tones showMarks />), { wrapper: MemoryRouter });

      const items = within(screen.getByRole('list', { name: 'အသံအမှတ်တစ်ခုစီပါသော ဝဏ္ဏတစ်ခု' })).getAllByRole('listitem');

      expect(items[0]).toHaveTextContent('အမှတ် မပါ');
      expect(items[1]).toHaveTextContent('ไม้เอก မိုင်းအေ့ ก่า အနိမ့်အသံ');
      expect(screen.getByText('မိုင်းကျတ်သဝါး')).toHaveAttribute('lang', 'my');
      expect(screen.getByText('မိုင်းကျတ်သဝါး')).not.toHaveTextContent('mai');
    });
  });
});
