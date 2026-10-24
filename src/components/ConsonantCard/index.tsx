import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getContentText, getMeaning, getPronunciation } from '../../helpers/language';
import { useTranslation } from '../../i18n';
import type { Consonant, Word } from '../../types/learning';
import AudioButton from '../AudioButton';

type CardSize = 'default' | 'compact';

interface ConsonantCardProps {
  consonant: Consonant;
  onPlayAudio?: (word: Word) => void;
  size?: CardSize;
  showWord?: boolean;
  showPicture?: boolean;
  showLetter?: boolean;
  showMeaning?: boolean;
  showPronunciation?: boolean;
}

const SIZE_CLASS_NAMES: Record<
  CardSize,
  {
    card: string;
    letter: string;
    picture: string;
    placeholder: string;
    word: string;
    meaning: string;
    pronunciation: string;
    content: string;
    audio: string;
  }
> = {
  default: {
    card: 'gap-1 rounded-3xl px-3 py-4',
    letter: 'text-[3.5rem]',
    picture: 'mb-2 w-26 rounded-2xl',
    placeholder: 'p-2 text-xs',
    word: 'text-2xl',
    meaning: 'text-[1.0625rem]',
    pronunciation: 'text-[0.9375rem] whitespace-nowrap',
    content: 'leading-[1.8]',
    audio: 'mt-2',
  },
  compact: {
    card: 'rounded-xl px-1 py-1',
    letter: 'text-[3.25rem]',
    picture: 'mb-1 w-14 rounded-xl',
    placeholder: 'p-1 text-[0.625rem]',
    word: 'text-lg',
    meaning: 'text-sm',
    pronunciation: 'block text-xs',
    content: 'leading-[1.5]',
    audio: 'mt-1',
  },
};

const ConsonantCard = ({
  consonant,
  onPlayAudio,
  size = 'default',
  showWord = true,
  showPicture = true,
  showLetter = true,
  showMeaning = true,
  showPronunciation = true,
}: ConsonantCardProps) => {
  const { lang, t } = useTranslation();
  const content = getContentText(lang);
  const headingId = `consonant-${consonant.id}`;
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
      <h3
        id={headingId}
        className={classNames('font-thai leading-[1.2] font-medium text-ink', sizeClassNames.letter, !showLetter && 'sr-only')}
        lang="th"
      >
        {consonant.character}
      </h3>
      <ul className="flex w-full flex-col gap-4" role="list">
        {consonant.words.map((word) => (
          <li key={word.id} className="flex flex-col items-center">
            {showPicture &&
              (word.image ? (
                <img
                  className={classNames('aspect-square object-contain', sizeClassNames.picture)}
                  src={assetUrl(word.image)}
                  alt={getMeaning(word, lang)}
                  lang={content.lang}
                />
              ) : (
                <div
                  className={classNames(
                    'grid aspect-square place-items-center border-2 border-dashed border-line-strong text-ink-muted',
                    sizeClassNames.picture,
                    sizeClassNames.placeholder
                  )}
                >
                  {t('cards.pictureSoon')}
                </div>
              ))}
            {showWord && (
              <p className={classNames('font-thai font-medium', sizeClassNames.word)} lang="th">
                {word.thai}
              </p>
            )}
            {(showMeaning || showPronunciation) && (
              <p className={classNames(content.font, sizeClassNames.content)} lang={content.lang}>
                {showMeaning && (
                  <span className={classNames('font-bold text-brand', sizeClassNames.meaning)}>{getMeaning(word, lang)}</span>
                )}
                {showMeaning && showPronunciation && ' '}
                {showPronunciation && (
                  <span className={classNames('text-ink-muted', sizeClassNames.pronunciation)}>
                    ({getPronunciation(word, lang)})
                  </span>
                )}
              </p>
            )}
            {word.audio && onPlayAudio && (
              <div className={sizeClassNames.audio}>
                <AudioButton label={t('audio.play', { word: word.thai })} onPlay={() => onPlayAudio(word)} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ConsonantCard;
