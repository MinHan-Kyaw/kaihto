import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import CardPartsMenu from '../../components/CardPartsMenu';
import ClassTabs from '../../components/ClassTabs';
import VowelCard from '../../components/VowelCard';
import VowelTable from '../../components/VowelTable';
import { consonantClasses, vowelGroups, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { isCombinable } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import { playAudio, stopAudio } from '../../services/audio';
import type { Vowel, VowelGroupId } from '../../types/learning';

const DEFAULT_GROUP_ID: VowelGroupId = 'short';

const isVowelGroupId = (value: string | null): value is VowelGroupId => vowelGroups.some((group) => group.id === value);

const counts = Object.fromEntries(
  vowelGroups.map((group) => [group.id, vowels.filter((vowel) => vowel.group === group.id).length])
) as Record<VowelGroupId, number>;

const overviewGroups = vowelGroups
  .filter((group) => group.id !== 'standalone')
  .map((group) => ({ ...group, vowels: vowels.filter((vowel) => vowel.group === group.id) }));

type VowelTabId = VowelGroupId | 'all';

// Labels are translation keys.
const tabs: { id: VowelTabId; label: string }[] = [
  ...vowelGroups.map((group) => ({ id: group.id, label: `vowelGroups.${group.id}.shortName` })),
  { id: 'all', label: 'common.all' },
];

const tabCounts: Record<VowelTabId, number> = {
  ...counts,
  all: overviewGroups.reduce((total, overviewGroup) => total + overviewGroup.vowels.length, 0),
};

// The pronunciation is Burmese script, so it is only offered in Burmese.
const CARD_PARTS = [
  { id: 'thai', label: 'cards.thai', burmeseOnly: false },
  { id: 'sound', label: 'cards.sound', burmeseOnly: false },
  { id: 'pronunciation', label: 'cards.pronunciation', burmeseOnly: true },
] as const;

type CardPart = (typeof CARD_PARTS)[number]['id'];

const handlePlayAudio = (vowel: Vowel) => {
  if (vowel.audio) {
    void playAudio(assetUrl(vowel.audio));
  }
};

interface VowelsProps {
  showAll?: boolean;
}

const Vowels = ({ showAll = false }: VowelsProps) => {
  const { lang, t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedGroupId = searchParams.get('group');
  const selectedGroupId = isVowelGroupId(requestedGroupId) ? requestedGroupId : DEFAULT_GROUP_ID;
  const group = vowelGroups.find((item) => item.id === selectedGroupId);
  const selectedTabId: VowelTabId = showAll ? 'all' : selectedGroupId;
  const groupVowels = vowels.filter((vowel) => vowel.group === selectedGroupId);
  const [shownParts, setShownParts] = useState<Record<CardPart, boolean>>({ thai: true, sound: true, pronunciation: true });

  useEffect(() => () => stopAudio(), []);

  const handleShownPartChange = (part: CardPart, checked: boolean) => {
    setShownParts((current) => ({ ...current, [part]: checked }));
  };

  const handleSelectTab = (tabId: VowelTabId) => {
    if (tabId === selectedTabId) {
      return;
    }
    void navigate(tabId === 'all' ? '/vowels/all' : `/vowels?group=${tabId}`, { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1 className="sr-only">{t('vowels.title')}</h1>

      <div className="sticky top-header z-5 -mx-4 -mt-2 bg-surface px-4 py-2">
        <ClassTabs
          items={tabs.map(({ id, label }) => ({ id, label: t(label) }))}
          counts={tabCounts}
          selectedId={selectedTabId}
          label={t('vowels.tabs')}
          countLabel={t('vowels.count')}
          onSelect={handleSelectTab}
        />
      </div>

      {showAll ? (
        <div className="relative mt-4">
          {/* Top right of the columns: the end of the last heading on wide screens, of the first one when they stack. */}
          <div className="absolute -top-2 right-0">
            <CardPartsMenu
              options={CARD_PARTS.filter(({ burmeseOnly }) => !burmeseOnly || lang === 'my').map(({ id, label }) => ({
                id,
                label: t(label),
                checked: shownParts[id],
              }))}
              onChange={handleShownPartChange}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {overviewGroups.map((overviewGroup) => (
              <section key={overviewGroup.id} aria-labelledby={`vowel-group-${overviewGroup.id}`}>
                <h2 id={`vowel-group-${overviewGroup.id}`} className="mb-2 text-center text-lg font-bold">
                  {t(`vowelGroups.${overviewGroup.id}.name`)}
                </h2>
                <ul
                  className="grid grid-cols-[repeat(auto-fill,minmax(6.75rem,1fr))] gap-2"
                  aria-labelledby={`vowel-group-${overviewGroup.id}`}
                  role="list"
                >
                  {overviewGroup.vowels.map((vowel) => (
                    <li key={vowel.id}>
                      <VowelCard
                        vowel={vowel}
                        size="large"
                        showVowel={shownParts.thai}
                        showSound={shownParts.sound}
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
        group && (
          <section className="mt-4" aria-labelledby="vowel-group-title">
            <h2 id="vowel-group-title" className="sr-only">
              {t(`vowelGroups.${group.id}.name`)}
            </h2>
            {groupVowels.every(isCombinable) ? (
              <VowelTable
                vowels={groupVowels}
                consonantClasses={consonantClasses}
                tones={group.tones}
                labelledBy="vowel-group-title"
                onPlayAudio={handlePlayAudio}
              />
            ) : (
              <ul className="grid grid-cols-4 gap-3" role="list" aria-labelledby="vowel-group-title">
                {groupVowels.map((vowel) => (
                  <li key={vowel.id}>
                    <VowelCard vowel={vowel} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      )}
    </>
  );
};

export default Vowels;
