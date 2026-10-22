import { getVowelLabel } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import type { VowelQuestion } from '../../types/learning';
import AudioButton from '../AudioButton';
import VowelSound from '../VowelSound';

interface VowelExplanationProps {
  question: VowelQuestion;
  consonantClassName: string;
  syllableName: string;
  toneName: string;
  onPlay: () => void;
}

const VowelExplanation = ({ question, consonantClassName, syllableName, toneName, onPlay }: VowelExplanationProps) => {
  const { t } = useTranslation();

  return question.kind === 'sound' ? (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-ink-muted">
      <span className="font-thai text-2xl font-medium text-ink" lang="th">
        {getVowelLabel(question.vowel)}
      </span>{' '}
      ={' '}
      <span className="font-bold">
        <VowelSound vowel={question.vowel} />
      </span>{' '}
      <AudioButton label={t('audio.hear', { text: getVowelLabel(question.vowel) })} onPlay={onPlay} />
    </p>
  ) : (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-ink-muted">
      <span className="font-thai font-medium text-ink" lang="th">
        {question.consonant.character}
      </span>{' '}
      <span>{consonantClassName}</span> +{' '}
      <span className="font-thai font-medium text-ink" lang="th">
        {getVowelLabel(question.vowel)}
      </span>{' '}
      <span>{syllableName}</span> →{' '}
      <span className="font-thai font-medium text-ink" lang="th">
        {question.syllable}
      </span>{' '}
      <strong className="text-ink">{toneName}</strong>{' '}
      <AudioButton label={t('audio.hear', { text: question.syllable })} onPlay={onPlay} />
    </p>
  );
};

export default VowelExplanation;
