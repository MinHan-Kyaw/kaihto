import { render, screen, within } from '@testing-library/react';

import type { ConsonantClass, ToneId } from '../../types/learning';

import ClassTable from '.';

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

const renderTable = ({ tones, withNumber = false }: { tones?: ToneId[]; withNumber?: boolean } = {}) =>
  render(
    <>
      <h2 id="title">Short vowels</h2>
      <ClassTable
        consonantClasses={consonantClasses}
        firstColumnLabel="Vowel"
        labelledBy="title"
        tones={tones}
        leadingHeaders={
          withNumber && (
            <th scope="col" rowSpan={tones ? 2 : 1}>
              No.
            </th>
          )
        }
      >
        <tr>
          {withNumber && <td>1</td>}
          <th scope="row">-ะ</th>
          <td>กะ</td>
          <td>ขะ</td>
        </tr>
      </ClassTable>
    </>
  );

describe('ClassTable', () => {
  it('names the table after its heading', () => {
    renderTable();

    expect(screen.getByRole('table', { name: 'Short vowels' })).toBeInTheDocument();
  });

  it('heads a column per class with its example consonant', () => {
    renderTable();

    const headers = screen.getAllByRole('columnheader');

    expect(headers.map((header) => header.textContent)).toEqual(['Vowel', 'Middle ก', 'High ข']);
    expect(within(headers[1] as HTMLElement).getByText('ก')).toHaveAttribute('lang', 'th');
  });

  it('shows the given rows', () => {
    renderTable();

    expect(
      within(screen.getByRole('row', { name: /^-ะ/ }))
        .getAllByRole('cell')
        .map((cell) => cell.textContent)
    ).toEqual(['กะ', 'ขะ']);
  });

  describe('given leading headers', () => {
    it('heads those columns before the first column', () => {
      renderTable({ withNumber: true });

      expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
        'No.',
        'Vowel',
        'Middle ก',
        'High ข',
      ]);
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
