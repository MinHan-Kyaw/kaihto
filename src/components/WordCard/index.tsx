import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getContentText, getMeaning } from '../../helpers/language';
import { useTranslation } from '../../i18n';
import type { MeaningWord } from '../../types/learning';
import AudioButton from '../AudioButton';

type CardSize = 'default' | 'compact';

interface WordCardProps {
  word: MeaningWord;
  onPlayAudio?: (word: MeaningWord) => void;
  size?: CardSize;
  showPicture?: boolean;
  showThai?: boolean;
  showMeaning?: boolean;
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
    thai: 'text-2xl',
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
}: WordCardProps) => {
  const { lang, t } = useTranslation();
  const content = getContentText(lang);
  const headingId = `word-${word.id}`;
  const sizeClassNames = SIZE_CLASS_NAMES[size];

  return (
    <article
      className={classNames(
        'flex h-full flex-col items-center border-2 border-line bg-surface text-center shadow-edge',
        sizeClassNames.card
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
        lang="th"
      >
        {word.thai}
      </h2>
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
