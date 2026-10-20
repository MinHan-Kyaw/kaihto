import { MemoryRouter } from 'react-router';

import { render, screen, within } from '@testing-library/react';

import { inBurmese } from '../../tests/fixtures';

import Tones from '.';

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

  it('shows the tone of each class for live and dead syllables', () => {
    renderTones();

    expect([0, 1, 2].map((column) => getCell(/Live syllable/, column).textContent)).toEqual([
      'กา Mid Tone',
      'ขา Rising Tone',
      'คา Mid Tone',
    ]);
    expect([0, 1, 2].map((column) => getCell(/Dead syllable/, column).textContent)).toEqual([
      'กะ Low Tone',
      'ขะ Low Tone',
      'คะ High Tone',
    ]);
  });

  it('shows the tone each mark gives and the marks a class does not use', () => {
    renderTones();

    expect(getCell(/ไม้เอก/, 2)).toHaveTextContent('ค่า Falling Tone');
    expect(getCell(/ไม้ตรี/, 0)).toHaveTextContent('ก๊า High Tone');
    expect(getCell(/ไม้ตรี/, 1)).toHaveTextContent('Not used');
  });

  describe('given the page is in Burmese', () => {
    it('names the tones and explains the rules in Burmese, keeping the Thai terms', () => {
      render(inBurmese(<Tones />), { wrapper: MemoryRouter });

      expect(screen.getByRole('heading', { level: 1, name: 'ထိုင်းအသံများ' })).toBeInTheDocument();
      expect(within(screen.getByRole('list', { name: 'အသံ ငါးမျိုး' })).getAllByRole('listitem')[0]).toHaveTextContent(
        'အလယ်အသံ เสียงสามัญ'
      );
      expect(screen.getByRole('rowheader', { name: /^အရှင်ဝဏ္ဏ คำเป็น/ })).toBeInTheDocument();
    });
  });
});
