import { classNames } from '../../helpers/classNames';
import { getVowelLabel } from '../../helpers/vowels';
import type { Vowel } from '../../types/learning';

type CardSize = 'default' | 'large';

interface VowelCardProps {
  vowel: Vowel;
  size?: CardSize;
}

const SIZE_CLASS_NAMES: Record<CardSize, { vowel: string; text: string }> = {
  default: { vowel: 'text-3xl', text: 'text-sm' },
  large: { vowel: 'text-5xl', text: 'text-lg' },
};

const VowelCard = ({ vowel, size = 'default' }: VowelCardProps) => {
  const sizeClassNames = SIZE_CLASS_NAMES[size];

  return (
    <article
      className="flex h-full min-h-18 flex-col items-center justify-center rounded-2xl border-2 border-line py-2 shadow-edge"
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
