import type { ReactNode } from 'react';

import { useTranslation } from '../../i18n';
import Button from '../Button';
import type { AnswerResult } from '../ResultIcon';

interface PracticeFeedbackProps {
  result: AnswerResult | null;
  correctAnswer: ReactNode;
  actionLabel: string;
  actionDisabled?: boolean;
  onAction: () => void;
}

const PracticeFeedback = ({ result, correctAnswer, actionLabel, actionDisabled = false, onAction }: PracticeFeedbackProps) => {
  const { t } = useTranslation();
  // The answer is a node (Thai text with its own lang), so it goes between the translated text around {answer}.
  const [beforeAnswer, afterAnswer] = t('practice.feedback.incorrect').split('{answer}');

  return (
    <div className="sticky bottom-0 -mx-4 mt-6 -mb-12 border-t-2 border-line bg-surface px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-content">
        <div className="sr-only" role="status">
          {result === 'correct' && t('practice.feedback.correct')}
          {result === 'incorrect' && (
            <>
              {beforeAnswer}
              {correctAnswer}
              {afterAnswer}
            </>
          )}
        </div>
        <Button variant={result === 'incorrect' ? 'danger' : 'primary'} fullWidth disabled={actionDisabled} onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default PracticeFeedback;
