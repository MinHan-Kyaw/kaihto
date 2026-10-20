import { classNames } from '../../helpers/classNames';
import { getContentText, getPronunciation } from '../../helpers/language';
import { getLetterWithWord } from '../../helpers/vocabulary';
import { useTranslation } from '../../i18n';
import type { PracticeQuestion, VocabularyItem } from '../../types/learning';
import AnswerOption from '../AnswerOption';
import type { AnswerResult } from '../ResultIcon';

interface AnswerOptionsProps {
  question: PracticeQuestion;
  selectedAnswerId: string | null;
  answered: boolean;
  onSelectAnswer: (answer: VocabularyItem) => void;
}

const getOptionResult = (
  option: VocabularyItem,
  question: PracticeQuestion,
  selectedAnswerId: string | null,
  answered: boolean
): AnswerResult | null => {
  if (!answered) {
    return null;
  }
  if (option.id === question.answer.id) {
    return 'correct';
  }
  return option.id === selectedAnswerId ? 'incorrect' : null;
};

const AnswerOptions = ({ question, selectedAnswerId, answered, onSelectAnswer }: AnswerOptionsProps) => {
  const { lang, t } = useTranslation();
  const content = getContentText(lang);

  return (
    <ul className="grid w-full gap-3 md:grid-cols-3" aria-label={t('common.answerOptions')} role="list">
      {question.options.map((option) => (
        <li key={option.id}>
          <AnswerOption
            selected={option.id === selectedAnswerId}
            result={getOptionResult(option, question, selectedAnswerId, answered)}
            disabled={answered}
            onSelect={() => onSelectAnswer(option)}
          >
            <span className="font-thai text-[1.625rem] leading-[1.3] font-medium" lang="th">
              {getLetterWithWord(option)}
            </span>{' '}
            <span className={classNames('text-[1.0625rem] leading-[1.8] text-ink-muted', content.font)} lang={content.lang}>
              {getPronunciation(option, lang)}
            </span>
          </AnswerOption>
        </li>
      ))}
    </ul>
  );
};

export default AnswerOptions;
