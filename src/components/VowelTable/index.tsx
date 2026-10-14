import { classNames } from '../../helpers/classNames';
import { combineVowel, getVowelLabel } from '../../helpers/vowels';
import type { ConsonantClass, Vowel } from '../../types/learning';
import AudioButton from '../AudioButton';
import ClassTable from '../ClassTable';
import VowelSound from '../VowelSound';

interface VowelTableProps {
  vowels: Vowel[];
  consonantClasses: ConsonantClass[];
  tones?: string[];
  labelledBy: string;
  onPlayAudio?: (vowel: Vowel) => void;
}

const VowelTable = ({ vowels, consonantClasses, tones, labelledBy, onPlayAudio }: VowelTableProps) => (
  <ClassTable
    consonantClasses={consonantClasses}
    firstColumnLabel="Vowel"
    labelledBy={labelledBy}
    tones={tones}
    leadingHeaders={
      <>
        {onPlayAudio && (
          <th scope="col" rowSpan={tones ? 2 : 1} className="w-px py-2 pr-0.5 pl-0.5 xs:pr-1 xs:pl-3">
            <span className="sr-only">Listen</span>
          </th>
        )}
        <th
          scope="col"
          rowSpan={tones ? 2 : 1}
          className={classNames(
            'w-px py-2 pr-0.5 text-sm text-ink-muted xs:pr-1',
            onPlayAudio ? 'pl-0.5 xs:pl-1' : 'pl-1 xs:pl-3'
          )}
        >
          <abbr className="no-underline" title="Number">
            No.
          </abbr>
        </th>
      </>
    }
  >
    {vowels.map((vowel, index) => (
      <tr key={vowel.id} className="border-b border-line last:border-b-0">
        {onPlayAudio && (
          <td className="w-px py-2 pr-0.5 pl-0.5 xs:pr-1 xs:pl-3">
            {vowel.audio && (
              <AudioButton label={`Play Thai audio for ${getVowelLabel(vowel)}`} onPlay={() => onPlayAudio(vowel)} />
            )}
          </td>
        )}
        <td
          className={classNames(
            'py-2 pr-0.5 text-sm font-bold text-ink-muted xs:pr-1',
            onPlayAudio ? 'pl-0.5 xs:pl-1' : 'pl-1 xs:pl-3'
          )}
        >
          {index + 1}
        </td>
        <th scope="row" className="w-px py-2 pr-0.5 pl-0.5 text-left xs:pr-1 xs:pl-2 sm:whitespace-nowrap">
          <span className="flex items-center gap-2 xs:gap-3 sm:gap-5">
            <span className="font-thai text-2xl font-medium whitespace-nowrap xs:text-3xl" lang="th">
              {getVowelLabel(vowel)}
            </span>{' '}
            <span className="text-sm leading-tight font-bold text-ink-muted">
              <VowelSound vowel={vowel} />
            </span>
          </span>
        </th>
        {consonantClasses.map(({ id, exampleConsonant, exampleSound }) => (
          <td key={id} className="px-0.5 py-2 xs:px-2">
            <span className="block font-thai text-2xl font-medium" lang="th">
              {combineVowel(exampleConsonant, vowel)}
            </span>{' '}
            <span className="text-sm font-bold text-ink-muted">
              {exampleSound}
              {vowel.sound}
            </span>
          </td>
        ))}
      </tr>
    ))}
  </ClassTable>
);

export default VowelTable;
