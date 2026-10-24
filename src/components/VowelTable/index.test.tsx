import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inBurmese } from '../../tests/fixtures';
import type { ConsonantClass, ToneId, Vowel } from '../../types/learning';

import VowelTable from '.';

const consonantClasses: ConsonantClass[] = [
  {
    id: 'middle',
    group: 1,
    tone: 'mid',
    exampleConsonant: 'ก',
    exampleSound: 'k',
  },
  {
    id: 'high',
    group: 2,
    tone: 'rising',
    exampleConsonant: 'ข',
    exampleSound: 'kh',
  },
];

const vowels: Vowel[] = [
  { id: '-ะ', group: 'short', sound: 'a', pronunciation: 'အ', audio: '/audio/vowels/a.m4a' },
  { id: '-ิ', group: 'short', sound: 'i', pronunciation: 'အိ' },
];

const renderTable = ({ tones, onPlayAudio }: { tones?: ToneId[]; onPlayAudio?: (vowel: Vowel) => void } = {}) =>
  render(
    <>
      <h2 id="title">Short vowels</h2>
      <VowelTable
        vowels={vowels}
        consonantClasses={consonantClasses}
        tones={tones}
        labelledBy="title"
        onPlayAudio={onPlayAudio}
      />
    </>
  );

const getVowelRow = (label: string) =>
  screen.getByRole('rowheader', { name: new RegExp(`^${label} `) }).closest('tr') as HTMLElement;

describe('VowelTable', () => {
  it('names the table after its heading and has one row per vowel', () => {
    renderTable();

    const table = screen.getByRole('table', { name: 'Short vowels' });

    expect(within(table).getAllByRole('row')).toHaveLength(vowels.length + 1);
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent)
    ).toEqual(['No.', 'Vowel', 'Middle ก', 'High ข']);
  });

  it('numbers the rows', () => {
    renderTable();

    expect(within(getVowelRow('-ะ')).getAllByRole('cell')[0]).toHaveTextContent('1');
    expect(within(getVowelRow('◌ิ')).getAllByRole('cell')[0]).toHaveTextContent('2');
  });

  it('shows the Thai vowel next to its English sound', () => {
    renderTable();

    const rowHeader = screen.getByRole('rowheader', { name: /^-ะ / });

    expect(rowHeader).toHaveTextContent('-ะ ( a )');
    expect(within(rowHeader).getByText('-ะ')).toHaveAttribute('lang', 'th');
  });

  describe('given the page is in Burmese', () => {
    it('adds the Burmese pronunciation and heads the columns in Burmese', () => {
      render(
        inBurmese(
          <>
            <h2 id="title">Short vowels</h2>
            <VowelTable vowels={vowels} consonantClasses={consonantClasses} labelledBy="title" />
          </>
        )
      );

      const rowHeader = screen.getByRole('rowheader', { name: /^-ะ / });

      expect(rowHeader).toHaveTextContent('-ะ ( အ - a )');
      expect(within(rowHeader).getByText('အ')).toHaveAttribute('lang', 'my');
      expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
        'စဉ်',
        'သရ',
        'အလယ်သံ ก',
        'အမြင့်သံ ข',
      ]);
    });
  });

  it('combines the vowel with each class example and its romanization', () => {
    renderTable();

    const cells = within(getVowelRow('-ะ')).getAllByRole('cell');

    expect(cells.slice(1).map((cell) => cell.textContent)).toEqual(['กะ ka', 'ขะ kha']);
  });

  it('shows a mark above the consonant on a dotted circle', () => {
    renderTable();

    expect(screen.getByRole('rowheader', { name: /^◌ิ / })).toBeInTheDocument();
  });

  describe('given an audio handler', () => {
    it('plays the audio of a vowel from the first cell of its row', async () => {
      const onPlayAudio = vi.fn();
      renderTable({ onPlayAudio });

      const [audioCell] = within(getVowelRow('-ะ')).getAllByRole('cell');

      await userEvent.click(within(audioCell as HTMLElement).getByRole('button', { name: 'Play Thai audio for -ะ' }));

      expect(onPlayAudio).toHaveBeenCalledWith(vowels[0]);
    });

    it('shows no play button for a vowel without audio', () => {
      renderTable({ onPlayAudio: vi.fn() });

      expect(within(getVowelRow('◌ิ')).queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('given no audio handler', () => {
    it('leaves out the play buttons', () => {
      renderTable();

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('given tones', () => {
    it('shows the tone under each class', () => {
      renderTable({ tones: ['low', 'high'] });

      const cells = within(screen.getByRole('row', { name: /^Tone/ })).getAllByRole('cell');

      expect(cells.map((cell) => cell.textContent)).toEqual(['Low', 'High']);
    });
  });

  describe('given no tones', () => {
    it('leaves out the tone row', () => {
      renderTable();

      expect(screen.queryByRole('row', { name: /^Tone/ })).not.toBeInTheDocument();
    });
  });
});
