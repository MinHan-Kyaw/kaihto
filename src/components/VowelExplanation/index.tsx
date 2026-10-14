import { getVowelLabel } from '../../helpers/vowels';
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

const VowelExplanation = ({ question, consonantClassName, syllableName, toneName, onPlay }: VowelExplanationProps) =>
  question.kind === 'sound' ? (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-ink-muted">
      <span className="font-thai text-2xl font-medium text-ink" lang="th">
        {getVowelLabel(question.vowel)}
      </span>{' '}
      ={' '}
      <span className="font-bold">
        <VowelSound vowel={question.vowel} />
      </span>{' '}
      <AudioButton label={`Hear ${getVowelLabel(question.vowel)}`} onPlay={onPlay} />
    </p>
  ) : (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-ink-muted">
      <span className="font-thai font-medium text-ink" lang="th">
        {question.consonant.character}
      </span>{' '}
      <span className="font-burmese" lang="my">
        {consonantClassName}
      </span>{' '}
      +{' '}
      <span className="font-thai font-medium text-ink" lang="th">
        {getVowelLabel(question.vowel)}
      </span>{' '}
      <span>{syllableName}</span> →{' '}
      <span className="font-thai font-medium text-ink" lang="th">
        {question.syllable}
      </span>{' '}
      <strong className="text-ink">{toneName}</strong> <AudioButton label={`Hear ${question.syllable}`} onPlay={onPlay} />
    </p>
  );

export default VowelExplanation;
