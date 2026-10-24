import { useEffect, useRef, type ReactNode } from 'react';

import { getVowelLabel } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';
import type { VowelQuestion as VowelQuestionType } from '../../types/learning';

interface VowelQuestionProps {
  question: VowelQuestionType;
  children: ReactNode;
}

const VowelQuestion = ({ question, children }: VowelQuestionProps) => {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstQuestion = useRef(true);

  useEffect(() => {
    if (isFirstQuestion.current) {
      isFirstQuestion.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <section className="flex flex-col items-center gap-4" aria-labelledby="vowel-question-prompt">
      <h2 id="vowel-question-prompt" className="rounded-xl text-center text-2xl font-extrabold" ref={headingRef} tabIndex={-1}>
        {t(`vowelPractice.prompts.${question.kind}`)}
      </h2>
      <p
        className="grid min-h-28 min-w-28 place-items-center rounded-3xl border-2 border-line px-4 font-thai text-[3.5rem] leading-[1.4] font-medium shadow-edge"
        lang="th"
      >
        {question.kind === 'sound' ? getVowelLabel(question.vowel) : question.syllable}
      </p>
      {children}
    </section>
  );
};

export default VowelQuestion;
