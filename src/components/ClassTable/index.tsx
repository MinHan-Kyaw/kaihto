import type { ReactNode } from 'react';

import { classNames } from '../../helpers/classNames';
import type { ConsonantClass } from '../../types/learning';

interface ClassTableProps {
  consonantClasses: ConsonantClass[];
  firstColumnLabel: ReactNode;
  labelledBy: string;
  leadingHeaders?: ReactNode; // header cells before the first column; give them rowSpan={2} when tones are shown
  tones?: string[]; // tone each class takes, shown under its header
  children: ReactNode;
}

const ClassTable = ({ consonantClasses, firstColumnLabel, labelledBy, leadingHeaders, tones, children }: ClassTableProps) => (
  <div className="overflow-x-auto rounded-2xl border-2 border-line">
    <table className="w-full border-collapse text-center" aria-labelledby={labelledBy}>
      <thead>
        <tr className={classNames('bg-brand-light', !tones && 'border-b-2 border-line')}>
          {leadingHeaders}
          <th scope="col" className={classNames('py-2 text-left', leadingHeaders ? 'px-1 xs:px-2' : 'px-2 xs:px-3')}>
            {firstColumnLabel}
          </th>
          {consonantClasses.map((consonantClass) => (
            <th key={consonantClass.id} scope="col" className="px-0.5 py-2 font-bold xs:px-2 xs:whitespace-nowrap">
              {consonantClass.shortName}{' '}
              <span className="font-thai font-medium text-brand" lang="th">
                {consonantClass.exampleConsonant}
              </span>
            </th>
          ))}
        </tr>
        {tones && (
          <tr className="border-b-2 border-line bg-brand-light">
            <th
              scope="row"
              className={classNames(
                'pb-2 text-left text-sm font-bold text-ink-muted',
                leadingHeaders ? 'px-1 xs:px-2' : 'px-2 xs:px-3'
              )}
            >
              Tone
            </th>
            {consonantClasses.map(({ id }, index) => (
              <td key={id} className="px-0.5 pb-2 xs:px-2">
                <span className="inline-block rounded-full border-2 border-brand-border bg-surface px-2 text-xs font-extrabold text-brand">
                  {tones[index]}
                </span>
              </td>
            ))}
          </tr>
        )}
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default ClassTable;
