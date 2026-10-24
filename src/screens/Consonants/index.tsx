import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import CardPartsMenu from '../../components/CardPartsMenu';
import ClassTabs from '../../components/ClassTabs';
import ConsonantCard from '../../components/ConsonantCard';
import { consonantClasses, consonants } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { getConsonantsByClass } from '../../helpers/vocabulary';
import { useTranslation } from '../../i18n';
import { playAudio, stopAudio } from '../../services/audio';
import type { ConsonantClassId, Word } from '../../types/learning';

const DEFAULT_CLASS_ID: ConsonantClassId = 'middle';

const isConsonantClassId = (value: string | null): value is ConsonantClassId =>
  consonantClasses.some((consonantClass) => consonantClass.id === value);

const counts = Object.fromEntries(
  consonantClasses.map((consonantClass) => [consonantClass.id, getConsonantsByClass(consonants, consonantClass.id).length])
) as Record<ConsonantClassId, number>;

type ConsonantTabId = ConsonantClassId | 'all';

// Labels are translation keys.
const tabs: { id: ConsonantTabId; label: string }[] = [
  ...consonantClasses.map((consonantClass) => ({ id: consonantClass.id, label: `classes.${consonantClass.id}.shortName` })),
  { id: 'all', label: 'common.all' },
];

const tabCounts: Record<ConsonantTabId, number> = { ...counts, all: consonants.length };

const CARD_PARTS = [
  { id: 'thai', label: 'cards.thai' },
  { id: 'meaning', label: 'cards.meaning' },
  { id: 'pronunciation', label: 'cards.pronunciation' },
] as const;

type CardPart = (typeof CARD_PARTS)[number]['id'];

const classes = consonantClasses.map((consonantClass) => ({
  ...consonantClass,
  consonants: getConsonantsByClass(consonants, consonantClass.id),
}));

const handlePlayAudio = (word: Word) => {
  if (word.audio) {
    void playAudio(assetUrl(word.audio));
  }
};

interface ConsonantsProps {
  showAll?: boolean;
}

const Consonants = ({ showAll = false }: ConsonantsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedClassId = searchParams.get('class');
  const selectedClassId = isConsonantClassId(requestedClassId) ? requestedClassId : DEFAULT_CLASS_ID;
  const selectedClass = consonantClasses.find((consonantClass) => consonantClass.id === selectedClassId);
  const selectedTabId: ConsonantTabId = showAll ? 'all' : selectedClassId;
  const visibleConsonants = getConsonantsByClass(consonants, selectedClassId);
  const [shownParts, setShownParts] = useState<Record<CardPart, boolean>>({ thai: true, meaning: true, pronunciation: true });

  useEffect(() => () => stopAudio(), []);

  const handleShownPartChange = (part: CardPart, checked: boolean) => {
    setShownParts((current) => ({ ...current, [part]: checked }));
  };

  const handleSelectTab = (tabId: ConsonantTabId) => {
    if (tabId === selectedTabId) {
      return;
    }
    void navigate(tabId === 'all' ? '/consonants/all' : `/consonants?class=${tabId}`, { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1 className="sr-only">{t('consonants.title')}</h1>

      <div className="sticky top-header z-5 -mx-4 -mt-2 bg-surface px-4 py-2">
        <ClassTabs
          items={tabs.map(({ id, label }) => ({ id, label: t(label) }))}
          counts={tabCounts}
          selectedId={selectedTabId}
          label={t('consonants.tabs')}
          countLabel={t('consonants.count')}
          onSelect={handleSelectTab}
        />
      </div>

      {showAll ? (
        <div className="relative mt-4">
          {/* Top right of the columns: the end of the last heading on wide screens, of the first one when they stack. */}
          <div className="absolute -top-2 right-0">
            <CardPartsMenu
              options={CARD_PARTS.map(({ id, label }) => ({ id, label: t(label), checked: shownParts[id] }))}
              onChange={handleShownPartChange}
            />
          </div>
          {/* The low class has more letters than the middle and high classes together, so it gets a double-width column. */}
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_2fr]">
            {classes.map((consonantClass) => (
              <section key={consonantClass.id} aria-labelledby={`consonant-class-${consonantClass.id}`}>
                <h2 id={`consonant-class-${consonantClass.id}`} className="mb-2 text-center text-lg font-bold">
                  {t(`classes.${consonantClass.id}.name`)}
                </h2>
                <ul
                  className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1.5"
                  aria-labelledby={`consonant-class-${consonantClass.id}`}
                  role="list"
                >
                  {consonantClass.consonants.map((consonant) => (
                    <li key={consonant.id}>
                      <ConsonantCard
                        consonant={consonant}
                        size="compact"
                        showWord={false}
                        showPicture={false}
                        showLetter={shownParts.thai}
                        showMeaning={shownParts.meaning}
                        showPronunciation={shownParts.pronunciation}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : (
        selectedClass && (
          <section className="mt-4" aria-labelledby="consonant-class-title">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id="consonant-class-title" className="text-[1.375rem] font-extrabold">
                {t(`classes.${selectedClass.id}.name`)}
              </h2>
              <span className="rounded-full bg-brand-light px-3 text-sm font-bold text-brand">
                {t(`tones.${selectedClass.tone}.name`)}
              </span>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4" role="list">
              {visibleConsonants.map((consonant) => (
                <li key={consonant.id}>
                  <ConsonantCard consonant={consonant} onPlayAudio={handlePlayAudio} />
                </li>
              ))}
            </ul>
          </section>
        )
      )}
    </>
  );
};

export default Consonants;
