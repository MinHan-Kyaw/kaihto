import { useEffect, useRef, type ReactNode } from 'react';

import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getContentText, getMeaning, getPronunciation } from '../../helpers/language';
import { getLetterWithWord } from '../../helpers/vocabulary';
import { useTranslation } from '../../i18n';
import type { PracticeQuestion as PracticeQuestionType } from '../../types/learning';

interface PracticeQuestionProps {
  question: PracticeQuestionType;
  children: ReactNode;
}

const PracticeQuestion = ({ question, children }: PracticeQuestionProps) => {
  const { lang, t } = useTranslation();
  const content = getContentText(lang);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstQuestion = useRef(true);
  const { answer, mode } = question;

  useEffect(() => {
    if (isFirstQuestion.current) {
      isFirstQuestion.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <section className="flex flex-col items-center gap-3" aria-labelledby="practice-question-prompt">
      {answer.image && (
        <div className="grid aspect-square w-[min(100%,10.5rem)] place-items-center rounded-3xl border-2 border-line bg-surface p-3 shadow-edge md:w-68">
          <img
            className="size-full object-contain drop-shadow-picture"
            src={assetUrl(answer.image)}
            alt={getMeaning(answer, lang)}
            lang={content.lang}
          />
        </div>
      )}
      <h2 id="practice-question-prompt" className="rounded-xl text-center text-2xl font-extrabold" ref={headingRef} tabIndex={-1}>
        {t(`practice.prompts.${mode}`)}
      </h2>
      {mode === 'type' && (
        <p className={classNames('-mt-2 text-[1.0625rem] leading-[1.8] text-ink-muted', content.font)} lang={content.lang}>
          {getPronunciation(answer, lang)}
        </p>
      )}
      {mode === 'class' && (
        <p className="-mt-1 flex flex-col items-center">
          <span className="font-thai text-[1.625rem] leading-[1.3] font-medium" lang="th">
            {getLetterWithWord(answer)}
          </span>{' '}
          <span className={classNames('text-[1.0625rem] leading-[1.8] text-ink-muted', content.font)} lang={content.lang}>
            {getPronunciation(answer, lang)}
          </span>
        </p>
      )}
      {children}
    </section>
  );
};

export default PracticeQuestion;
