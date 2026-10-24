import type { CSSProperties } from 'react';

import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getContentText, getMeaning } from '../../helpers/language';
import { useTranslation } from '../../i18n';
import type { MeaningWord, Tone } from '../../types/learning';
import AudioButton from '../AudioButton';
import ToneContour from '../ToneContour';

type CardSize = 'default' | 'compact';

// Marks above and below a consonant take no width of their own.
const THAI_MARKS = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;

// A Thai word can't wrap, so on compact cards a long one shrinks to fit: each letter takes about 0.55em, so a word of n
// letters fits at 100cqi / (0.55n), about 180cqi / n, of the card's width.
const getThaiFit = (thai: string) => ({ '--thai-fit': `${(180 / thai.replace(THAI_MARKS, '').length).toFixed(1)}cqi` });

interface WordCardProps {
  word: MeaningWord;
  onPlayAudio?: (word: MeaningWord) => void;
  size?: CardSize;
  showPicture?: boolean;
  showThai?: boolean;
  showMeaning?: boolean;
  tones?: { syllable: string; tone: Tone }[]; // one per syllable, shown as pitch curves in the top right corner
}

const SIZE_CLASS_NAMES: Record<CardSize, { card: string; picture: string; thai: string; meaning: string }> = {
  default: {
    card: 'gap-1 rounded-3xl px-3 py-4',
    picture: 'mb-1 w-20',
    thai: 'text-[2rem]',
    meaning: 'text-[1.0625rem]',
  },
  compact: {
    card: 'justify-center rounded-xl px-1 py-2',
    picture: 'w-12',
    thai: 'text-[min(2.25rem,var(--thai-fit))]',
    meaning: 'text-sm',
  },
};

const WordCard = ({
  word,
  onPlayAudio,
  size = 'default',
  showPicture = true,
  showThai = true,
  showMeaning = true,
  tones,
}: WordCardProps) => {
  const { lang, t } = useTranslation();
  const content = getContentText(lang);
  const headingId = `word-${word.id}`;
  const sizeClassNames = SIZE_CLASS_NAMES[size];

  return (
    <article
      className={classNames(
        '@container relative flex h-full flex-col items-center border-2 border-line bg-surface text-center shadow-edge',
        sizeClassNames.card,
        tones && 'pt-7'
      )}
      aria-labelledby={headingId}
      data-size={size}
    >
      {showPicture && (
        <img
          className={classNames('aspect-square object-contain', sizeClassNames.picture)}
          src={assetUrl(word.image)}
          alt={getMeaning(word, lang)}
          lang={content.lang}
        />
      )}
      <h2
        id={headingId}
        className={classNames('font-thai leading-[1.3] font-medium text-ink', sizeClassNames.thai, !showThai && 'sr-only')}
        style={getThaiFit(word.thai) as CSSProperties}
        lang="th"
      >
        {word.thai}
      </h2>
      {tones && (
        // Only the pitch curves show, in the top right corner; the tone names are for screen readers.
        <p className="absolute top-1 right-1.5 flex gap-1">
          <span className="sr-only">{t('cards.tone')}</span>
          {tones.map(({ syllable, tone }) => (
            <span key={syllable}>
              <ToneContour pitch={tone.pitch} size="small" />
              <span className="sr-only"> {t(`tones.${tone.id}.shortName`)}</span>
            </span>
          ))}
        </p>
      )}
      {showMeaning && (
        <p className={classNames('leading-[1.6] font-bold text-brand', content.font, sizeClassNames.meaning)} lang={content.lang}>
          {getMeaning(word, lang)}
        </p>
      )}
      {onPlayAudio && (
        <div className="mt-auto pt-1">
          <AudioButton label={t('audio.play', { word: word.thai })} onPlay={() => onPlayAudio(word)} />
        </div>
      )}
    </article>
  );
};

export default WordCard;
