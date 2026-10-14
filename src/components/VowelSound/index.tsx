import type { Vowel } from '../../types/learning';

interface VowelSoundProps {
  vowel: Vowel;
}

// "( အ - a )": Burmese pronunciation, then the English sound. On narrow screens it may break before the dash.
const VowelSound = ({ vowel }: VowelSoundProps) => (
  <>
    <span className="whitespace-nowrap">
      ({' '}
      <span className="font-burmese font-normal text-brand" lang="my">
        {vowel.pronunciation}
      </span>
    </span>{' '}
    <span className="whitespace-nowrap">- {vowel.sound} )</span>
  </>
);

export default VowelSound;
