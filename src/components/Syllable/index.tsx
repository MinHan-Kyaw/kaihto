import { useTranslation } from '../../i18n';
import type { Tone } from '../../types/learning';

interface SyllableProps {
  text: string;
  tone: Tone;
}

const Syllable = ({ text, tone }: SyllableProps) => {
  const { t } = useTranslation();

  return (
    <span className="flex flex-col items-center" data-tone={tone.id}>
      <span className="font-thai text-2xl leading-[1.4] font-medium" lang="th">
        {text}
      </span>{' '}
      <span className="text-xs leading-tight font-bold whitespace-nowrap text-ink-muted">{t(`tones.${tone.id}.name`)}</span>
    </span>
  );
};

export default Syllable;
