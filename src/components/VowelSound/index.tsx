import { useTranslation } from '../../i18n';
import type { Vowel } from '../../types/learning';

interface VowelSoundProps {
  vowel: Vowel;
}

// "( အ - a )": Burmese pronunciation, then the English sound; in English just "( a )". On narrow screens it may break
// before the dash.
const VowelSound = ({ vowel }: VowelSoundProps) => {
  const { lang } = useTranslation();

  if (lang === 'en') {
    return <span className="whitespace-nowrap">( {vowel.sound} )</span>;
  }

  return (
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
};

export default VowelSound;
