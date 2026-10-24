import { useEffect, useRef } from 'react';

import { useTranslation } from '../../i18n';
import Button from '../Button';
import ButtonLink from '../Button/ButtonLink';

interface PracticeSummaryProps {
  score: number;
  total: number;
  onRestart: () => void;
  explore?: { to: string; label: string }; // label is a translation key
}

// The translation key of the encouragement for a score.
const getMessage = (score: number, total: number): string => {
  const ratio = total > 0 ? score / total : 0;

  if (ratio === 1) {
    return 'practice.summary.perfect';
  }
  if (ratio >= 0.7) {
    return 'practice.summary.great';
  }
  if (ratio >= 0.4) {
    return 'practice.summary.nice';
  }
  return 'practice.summary.keepGoing';
};

const PracticeSummary = ({
  score,
  total,
  onRestart,
  explore = { to: '/consonants', label: 'practice.summary.exploreConsonants' },
}: PracticeSummaryProps) => {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 text-center"
      aria-labelledby="practice-summary-title"
    >
      <h1 id="practice-summary-title" className="rounded-xl text-[2rem] font-extrabold text-brand" ref={headingRef} tabIndex={-1}>
        {t('practice.summary.complete')}
      </h1>
      <div className="flex w-full flex-col items-center rounded-3xl border-2 border-brand-border bg-brand-light p-6 shadow-edge-brand-soft">
        <span className="text-[0.8125rem] font-bold tracking-[0.05em] text-ink-muted uppercase">
          {t('practice.summary.score')}
        </span>
        <span className="text-5xl leading-[1.2] font-extrabold">
          {score} / {total}
        </span>
      </div>
      <p className="text-lg">{t(getMessage(score, total))}</p>
      <div className="mt-2 grid w-full gap-3">
        <Button fullWidth onClick={onRestart}>
          {t('practice.summary.again')}
        </Button>
        <ButtonLink to={explore.to} variant="secondary" fullWidth>
          {t(explore.label)}
        </ButtonLink>
        <ButtonLink to="/practice" variant="secondary" fullWidth>
          {t('practice.summary.chooseAnother')}
        </ButtonLink>
      </div>
    </section>
  );
};

export default PracticeSummary;
