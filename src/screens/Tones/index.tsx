import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import AudioButton from '../../components/AudioButton';
import ButtonLink from '../../components/Button/ButtonLink';
import ClassTable from '../../components/ClassTable';
import ClassTabs from '../../components/ClassTabs';
import ToneContour from '../../components/ToneContour';
import { consonantClasses, consonants, guide, toneById, toneMarks, tones, vowelGroups, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { getContentText, getPronunciation } from '../../helpers/language';
import { getMarkedTone } from '../../helpers/tones';
import { findSyllable, getSyllable, getSyllableTone } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import { playAudio, stopAudio } from '../../services/audio';
import type { Consonant, ConsonantClassId, Tone, ToneId, ToneMark, Vowel, VowelGroupId } from '../../types/learning';

type TonesTabId = 'tones' | 'marks';

const TAB_PATHS: Record<TonesTabId, string> = { tones: '/tones', marks: '/tones/marks' };

// Labels are translation keys.
const tabs: { id: TonesTabId; label: string }[] = [
  { id: 'tones', label: 'tonesPage.tonesTab' },
  { id: 'marks', label: 'tonesPage.marksTab' },
];

const tabCounts: Record<TonesTabId, number> = { tones: tones.length, marks: toneMarks.length };

interface ToneRow {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  getTone: (consonantClass: ConsonantClassId, index: number) => ToneId | undefined;
}

// Short and long vowels, with the tone each consonant group takes as the source states it (the Vowels page shows the same).
const VOWEL_LENGTHS: VowelGroupId[] = ['short', 'long'];

interface MarkedSyllable {
  id: string;
  mark?: ToneMark; // none for the syllable with no mark
  example: string;
  audio: string;
  tone: Tone;
}

// The source's chart: กา with no mark and with each of the four marks. Its consonant is middle class, which takes all
// four marks, so the five syllables have the five tones.
const { consonant: exampleConsonant, vowel: exampleVowel } = findSyllable(
  guide.toneMarks.unmarked.example,
  consonants,
  vowels
) as {
  consonant: Consonant;
  vowel: Vowel;
};

const markedSyllables: MarkedSyllable[] = [
  {
    id: 'none',
    ...guide.toneMarks.unmarked,
    tone: toneById[getSyllableTone(exampleConsonant, exampleVowel)],
  },
  ...toneMarks.map((mark) => ({
    id: mark.mark,
    mark,
    example: mark.example,
    audio: mark.audio,
    tone: toneById[getMarkedTone(exampleConsonant.class, mark.mark) as ToneId],
  })),
];

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
                  <span className="font-bold" data-tone={toneId}>
                    {t(`tones.${toneId}.name`)}
                  </span>
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

const FiveTones = () => {
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
      getTone: (_, index) => group?.tones?.[index],
    };
  });

  return (
    <>
      <section aria-labelledby="five-tones-title">
        <h2 id="five-tones-title" className="text-[1.375rem] font-extrabold">
          {t('tonesPage.five')}
        </h2>
        <p className="mt-1 text-ink-muted">{t('tonesPage.intro')}</p>
        {/* A compact row per tone on phones and tablets; all five side by side, stacked, on wide screens. */}
        <ul className="mt-4 grid gap-2 xs:grid-cols-2 lg:grid-cols-5" role="list" aria-label={t('tonesPage.five')}>
          {tones.map((tone) => (
            <li
              key={tone.id}
              className="flex items-center gap-3 rounded-2xl border-2 border-line px-3 py-2 shadow-edge lg:flex-col lg:gap-1 lg:py-3 lg:text-center"
            >
              <ToneContour pitch={tone.pitch} />
              <span className="flex min-w-0 flex-1 flex-col lg:flex-none">
                <span className="font-extrabold">{t(`tones.${tone.id}.name`)}</span>{' '}
                <span className="font-thai text-sm text-ink-muted" lang="th">
                  {tone.thaiName}
                </span>
              </span>
              <AudioButton
                label={t('audio.hear', { text: t(`tones.${tone.id}.name`) })}
                onPlay={() => void playAudio(assetUrl(tone.audio))}
              />
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
    </>
  );
};

const FourMarks = () => {
  const { lang, t } = useTranslation();
  const contentText = getContentText(lang);

  const markRows = toneMarks.map(({ mark, thaiName }): ToneRow => ({
    id: mark,
    label: (
      <span className="font-thai font-medium" lang="th">
        อ{mark} {thaiName}
      </span>
    ),
    getTone: (consonantClass) => getMarkedTone(consonantClass, mark),
  }));

  return (
    <>
      <section aria-labelledby="four-marks-title">
        <h2 id="four-marks-title" className="text-[1.375rem] font-extrabold">
          {t('tonesPage.fourMarks')}
        </h2>
        <p className="mt-1 font-thai text-lg font-medium" lang="th">
          {guide.toneMarks.summary}
        </p>
        <p className="mt-1 text-ink-muted">{t('tonesPage.fourMarksIntro')}</p>
        {/* A row per syllable on phones and tablets; the source's five columns, stacked, on wide screens. */}
        <ul className="mt-4 grid gap-2 lg:grid-cols-5" role="list" aria-label={t('tonesPage.markedSyllables')}>
          {markedSyllables.map(({ id, mark, example, audio, tone }) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-2xl border-2 border-line px-3 py-2 shadow-edge lg:flex-col lg:gap-2 lg:py-4 lg:text-center"
              data-tone={tone.id}
            >
              <span
                className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand-light pt-2 font-thai text-[2.75rem] leading-none text-brand lg:size-18 lg:pt-3 lg:text-[3.5rem]"
                lang="th"
                aria-hidden="true"
              >
                {mark ? `◌${mark.mark}` : ''}
              </span>
              {/* As tall as a Thai name over its pronunciation, so the syllables line up on wide screens. */}
              <span className="flex min-w-0 flex-1 flex-col lg:min-h-11 lg:flex-none lg:justify-center">
                {mark ? (
                  <>
                    <span className="font-thai font-medium" lang="th">
                      {mark.thaiName}
                    </span>{' '}
                    <span className={`text-sm text-ink-muted ${contentText.font}`} lang={contentText.lang}>
                      {getPronunciation(mark, lang)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">{t('tonesPage.noMark')}</span>
                )}
              </span>{' '}
              <span className="flex min-w-24 shrink-0 flex-col items-center lg:border-t-2 lg:border-line lg:pt-2">
                <span className="font-thai text-[2rem] leading-[1.4] font-medium" lang="th">
                  {example}
                </span>{' '}
                {/* The curve sits above the tone name on phones, so a long name never wraps. */}
                <span className="flex flex-col items-center text-sm font-bold whitespace-nowrap lg:flex-row lg:gap-1">
                  <ToneContour pitch={tone.pitch} size="small" />
                  {t(`tones.${tone.id}.name`)}
                </span>
              </span>
              <AudioButton label={t('audio.hear', { text: example })} onPlay={() => void playAudio(assetUrl(audio))} />
            </li>
          ))}
        </ul>
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
    </>
  );
};

interface TonesProps {
  showMarks?: boolean;
}

const Tones = ({ showMarks = false }: TonesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedTabId: TonesTabId = showMarks ? 'marks' : 'tones';

  useEffect(() => () => stopAudio(), []);

  const handleSelectTab = (tabId: TonesTabId) => {
    if (tabId === selectedTabId) {
      return;
    }
    void navigate(TAB_PATHS[tabId], { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1 className="sr-only">{t('tonesPage.title')}</h1>

      <div className="sticky top-header z-5 -mx-4 -mt-2 bg-surface px-4 py-2">
        <ClassTabs
          items={tabs.map(({ id, label }) => ({ id, label: t(label) }))}
          counts={tabCounts}
          selectedId={selectedTabId}
          label={t('tonesPage.tabs')}
          countLabel={{ tones: t('tonesPage.tonesCount'), marks: t('tonesPage.marksCount') }}
          onSelect={handleSelectTab}
        />
      </div>

      <div className="mt-4 flex flex-col gap-8">
        {showMarks ? <FourMarks /> : <FiveTones />}

        <ButtonLink to="/vowels" variant="secondary" fullWidth>
          {t('tonesPage.exploreVowels')}
        </ButtonLink>
      </div>
    </>
  );
};

export default Tones;
