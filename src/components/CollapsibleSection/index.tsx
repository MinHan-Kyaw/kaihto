import type { ReactNode } from 'react';

import { classNames } from '../../helpers/classNames';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  count: number;
  countLabel: string; // read after the count by screen readers, e.g. "words"
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

// A section whose h2 heading is a button that shows or hides its content. The section is named by the title alone.
const CollapsibleSection = ({ id, title, count, countLabel, open, onToggle, children }: CollapsibleSectionProps) => (
  <section aria-labelledby={`${id}-title`}>
    <h2 className="text-lg font-bold">
      <button
        type="button"
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl text-left hover:text-brand"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={onToggle}
      >
        <svg
          className={classNames('size-5 shrink-0 text-ink-muted transition-transform', open && 'rotate-90')}
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M7.5 4.5 13 10l-5.5 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span id={`${id}-title`}>{title}</span>{' '}
        <span className="inline-grid h-6 min-w-6 place-items-center rounded-full bg-brand-light px-1.5 text-[0.8125rem] leading-none font-extrabold text-ink-muted">
          {count} <span className="sr-only">{countLabel}</span>
        </span>
      </button>
    </h2>
    <div id={`${id}-content`} className="mt-2" hidden={!open}>
      {children}
    </div>
  </section>
);

export default CollapsibleSection;
