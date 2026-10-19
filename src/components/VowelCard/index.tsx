import { classNames } from '../../helpers/classNames';
import { getVowelLabel } from '../../helpers/vowels';
import type { Vowel } from '../../types/learning';

type CardSize = 'default' | 'large';

interface VowelCardProps {
  vowel: Vowel;
  size?: CardSize;
}

const SIZE_CLASS_NAMES: Record<CardSize, { card: string; vowel: string; text: string }> = {
  default: { card: 'min-h-18 py-2', vowel: 'text-3xl', text: 'text-sm' },
  large: { card: 'px-1 py-1', vowel: 'text-5xl leading-[1.5] whitespace-nowrap lg:text-6xl', text: 'text-sm' },
};

const VowelCard = ({ vowel, size = 'default' }: VowelCardProps) => {
  const sizeClassNames = SIZE_CLASS_NAMES[size];

  return (
    <article
      className={classNames(
        'flex h-full flex-col items-center justify-center rounded-2xl border-2 border-line shadow-edge',
        sizeClassNames.card
      )}
      aria-labelledby={`vowel-${vowel.id}`}
      data-size={size}
    >
      <h3 id={`vowel-${vowel.id}`} className={classNames('font-thai font-medium', sizeClassNames.vowel)} lang="th">
        {getVowelLabel(vowel)}
      </h3>{' '}
      <span className={classNames('font-bold text-ink-muted', sizeClassNames.text)}>{vowel.sound}</span>{' '}
      <span className={classNames('font-burmese text-brand', sizeClassNames.text)} lang="my">
        {vowel.pronunciation}
      </span>
    </article>
  );
};

export default VowelCard;
