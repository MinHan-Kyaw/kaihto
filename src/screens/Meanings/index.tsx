import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import CardPartsMenu from '../../components/CardPartsMenu';
import ClassTabs from '../../components/ClassTabs';
import WordCard from '../../components/WordCard';
import { consonants, meanings, toneById, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { getPronunciation } from '../../helpers/language';
import { findSyllable, getSyllableTone } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import { playAudio, stopAudio } from '../../services/audio';
import type { MeaningWord } from '../../types/learning';

type MeaningsTabId = 'pictures' | 'text';

const TAB_PATHS: Record<MeaningsTabId, string> = { pictures: '/meanings', text: '/meanings/text' };

// Labels are translation keys.
const tabs: { id: MeaningsTabId; label: string }[] = [
  { id: 'pictures', label: 'meanings.pictures' },
  { id: 'text', label: 'meanings.text' },
];

const tabCounts: Record<MeaningsTabId, number> = { pictures: meanings.length, text: meanings.length };

const CARD_PARTS = [
  { id: 'thai', label: 'cards.thai' },
  { id: 'tone', label: 'cards.tone' },
  { id: 'meaning', label: 'cards.meaning' },
  { id: 'pronunciation', label: 'cards.pronunciation' },
] as const;

type CardPart = (typeof CARD_PARTS)[number]['id'];

// Each syllable's tone, from its consonant's class and its vowel's length (the words have no tone marks).
const getWordTones = (word: MeaningWord) =>
  word.syllables.flatMap((syllable) => {
    const spelling = findSyllable(syllable, consonants, vowels);

    return spelling ? [{ syllable, tone: toneById[getSyllableTone(spelling.consonant, spelling.vowel)] }] : [];
  });

const wordTones = new Map(meanings.map((word) => [word.id, getWordTones(word)]));

const handlePlayAudio = (word: MeaningWord) => {
  void playAudio(assetUrl(word.audio));
};

interface MeaningsProps {
  showText?: boolean;
}

const Meanings = ({ showText = false }: MeaningsProps) => {
  const { lang, t } = useTranslation();
  const navigate = useNavigate();
  const selectedTabId: MeaningsTabId = showText ? 'text' : 'pictures';
  // The option appears only when some word has a pronunciation in the page's language.
  const hasPronunciation = meanings.some((word) => getPronunciation(word, lang));
  const [shownParts, setShownParts] = useState<Record<CardPart, boolean>>({
    thai: true,
    tone: true,
    meaning: true,
    pronunciation: true,
  });

  useEffect(() => () => stopAudio(), []);

  const handleShownPartChange = (part: CardPart, checked: boolean) => {
    setShownParts((current) => ({ ...current, [part]: checked }));
  };

  const handleSelectTab = (tabId: MeaningsTabId) => {
    if (tabId === selectedTabId) {
      return;
    }
    void navigate(TAB_PATHS[tabId], { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <h1 className="sr-only">{t('meanings.title')}</h1>

      <div className="sticky top-header z-5 -mx-4 -mt-2 bg-surface px-4 py-2">
        <ClassTabs
          items={tabs.map(({ id, label }) => ({ id, label: t(label) }))}
          counts={tabCounts}
          selectedId={selectedTabId}
          label={t('meanings.tabs')}
          countLabel={t('meanings.count')}
          onSelect={handleSelectTab}
        />
      </div>

      {showText ? (
        <div className="mt-4">
          <div className="mb-2 flex justify-end">
            <CardPartsMenu
              options={CARD_PARTS.filter(({ id }) => id !== 'pronunciation' || hasPronunciation).map(({ id, label }) => ({
                id,
                label: t(label),
                checked: shownParts[id],
              }))}
              onChange={handleShownPartChange}
            />
          </div>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2" role="list">
            {meanings.map((word) => (
              <li key={word.id}>
                <WordCard
                  word={word}
                  size="compact"
                  showPicture={false}
                  showThai={shownParts.thai}
                  showMeaning={shownParts.meaning}
                  showPronunciation={shownParts.pronunciation}
                  tones={shownParts.tone ? wordTones.get(word.id) : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul
          className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(min(100%,8.5rem),1fr))] gap-3 xs:gap-4 md:grid-cols-5"
          role="list"
        >
          {meanings.map((word) => (
            <li key={word.id}>
              <WordCard word={word} onPlayAudio={handlePlayAudio} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Meanings;
