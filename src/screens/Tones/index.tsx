import type { ReactNode } from 'react';

import ButtonLink from '../../components/Button/ButtonLink';
import ClassTable from '../../components/ClassTable';
import Syllable from '../../components/Syllable';
import ToneContour from '../../components/ToneContour';
import { consonantClasses, guide, toneById, toneMarks, tones, vowelGroups, vowels } from '../../data';
import { getMarkedTone } from '../../helpers/tones';
import { combineVowel, getSyllable } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import type { ConsonantClassId, ToneId, Vowel, VowelGroupId } from '../../types/learning';

interface ToneRow {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  spell: (consonant: string) => string;
  getTone: (consonantClass: ConsonantClassId, index: number) => ToneId | undefined;
}

const longVowel = vowels.find((vowel) => vowel.group === 'long') as Vowel;

// Short and long vowels, with the tone each consonant group takes as the source states it (the Vowels page shows the same).
const VOWEL_LENGTHS: VowelGroupId[] = ['short', 'long'];

const ToneTable = ({ rows, firstColumnLabel, labelledBy }: { rows: ToneRow[]; firstColumnLabel: string; labelledBy: string }) => {
  const { t } = useTranslation();

  return (
    <ClassTable
      consonantClasses={consonantClasses}
      firstColumnLabel={<span className="sr-only">{firstColumnLabel}</span>}
      labelledBy={labelledBy}
      showGroups
    >
      {rows.map((row) => (
        <tr key={row.id} className="border-b border-line last:border-b-0">
          <th scope="row" className="px-2 py-2 text-left font-bold xs:px-3">
            {row.label}
            {row.detail && (
              <>
                {' '}
                <span className="block text-[0.8125rem] leading-[1.6] font-normal text-ink-muted">{row.detail}</span>
              </>
            )}
          </th>
          {consonantClasses.map((consonantClass, index) => {
            const toneId = row.getTone(consonantClass.id, index);

            return (
              <td key={consonantClass.id} className="px-1 py-2 xs:px-2">
                {toneId ? (
                  <Syllable text={row.spell(consonantClass.exampleConsonant)} tone={toneById[toneId]} />
                ) : (
                  <span className="text-ink-muted">
                    — <span className="sr-only">{t('tonesPage.notUsed')}</span>
                  </span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </ClassTable>
  );
};

const Tones = () => {
  const { t } = useTranslation();

  const vowelRows = VOWEL_LENGTHS.map((groupId): ToneRow => {
    const group = vowelGroups.find((item) => item.id === groupId);
    const vowel = vowels.find((item) => item.group === groupId) as Vowel;
    const syllable = getSyllable(vowel);

    return {
      id: groupId,
      label: t(`vowelGroups.${groupId}.name`),
      detail: (
        <>
          {t(`syllables.${syllable}.name`)}{' '}
          <span className="font-thai font-medium" lang="th">
            {guide.syllables[syllable].thaiName}
          </span>
        </>
      ),
      spell: (consonant) => combineVowel(consonant, vowel),
      getTone: (_, index) => group?.tones?.[index],
    };
  });

  const markRows = toneMarks.map(({ mark, thaiName }): ToneRow => ({
    id: mark,
    label: (
      <span className="font-thai font-medium" lang="th">
        อ{mark} {thaiName}
      </span>
    ),
    spell: (consonant) => combineVowel(`${consonant}${mark}`, longVowel),
    getTone: (consonantClass) => getMarkedTone(consonantClass, mark),
  }));

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="tones-title">
        <h1 id="tones-title" className="text-[1.75rem] font-extrabold">
          {t('tonesPage.title')}
        </h1>
        <p className="mt-1 text-ink-muted">{t('tonesPage.intro')}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2" role="list" aria-label={t('tonesPage.five')}>
          {tones.map((tone) => (
            <li key={tone.id} className="flex items-center gap-4 rounded-2xl border-2 border-line px-4 py-3 shadow-edge">
              <ToneContour pitch={tone.pitch} />
              <span className="flex flex-col">
                <span className="text-lg font-extrabold">{t(`tones.${tone.id}.name`)}</span>{' '}
                <span className="font-thai text-ink-muted" lang="th">
                  {tone.thaiName}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="vowel-tones-title">
        <h2 id="vowel-tones-title" className="text-[1.375rem] font-extrabold">
          {t('tonesPage.vowelTones')}
        </h2>
        <p className="mt-1 text-ink-muted">{t('tonesPage.vowelTonesNote')}</p>
        <div className="mt-4">
          <ToneTable rows={vowelRows} firstColumnLabel={t('vowelTable.vowel')} labelledBy="vowel-tones-title" />
        </div>
      </section>

      <section aria-labelledby="tone-marks-title">
        <h2 id="tone-marks-title" className="text-[1.375rem] font-extrabold">
          {t('tonesPage.marks')}
        </h2>
        <p className="mt-1 text-ink-muted">{t('tonesPage.marksNote')}</p>
        <div className="mt-4">
          <ToneTable rows={markRows} firstColumnLabel={t('tonesPage.markDetail')} labelledBy="tone-marks-title" />
        </div>
      </section>

      <ButtonLink to="/vowels" variant="secondary" fullWidth>
        {t('tonesPage.exploreVowels')}
      </ButtonLink>
    </div>
  );
};

export default Tones;
