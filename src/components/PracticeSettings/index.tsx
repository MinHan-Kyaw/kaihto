import { Fragment, useId, useState } from 'react';

import type { AnswerMode } from '../../types/learning';
import DotsMenu from '../DotsMenu';

export interface QuestionTypeOption {
  mode: AnswerMode;
  label: string;
  checked: boolean;
  unavailable?: boolean;
}

export interface QuestionCount {
  value: number;
  min: number;
  max: number;
}

interface PracticeSettingsProps {
  questionCount: QuestionCount;
  onQuestionCountChange: (count: number) => void;
  questionTypes?: QuestionTypeOption[];
  onQuestionTypeChange: (mode: AnswerMode, checked: boolean) => void;
}

const STEPPER_BUTTON_CLASS_NAME =
  'relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-line-strong text-base leading-none font-extrabold text-brand after:absolute after:-inset-1.5 hover:bg-brand-light disabled:cursor-not-allowed disabled:text-ink-muted disabled:opacity-50 disabled:hover:bg-transparent';

const QuestionCountStepper = ({ value, min, max, onChange }: QuestionCount & { onChange: (count: number) => void }) => {
  const labelId = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const change = (count: number) => {
    setDraft(null);
    const clamped = Math.min(max, Math.max(min, count));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const commitDraft = () => {
    if (draft === null) {
      return;
    }
    const count = Number.parseInt(draft, 10);
    setDraft(null);
    if (!Number.isNaN(count)) {
      change(count);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-2">
      <span id={labelId} className="text-sm font-bold text-ink">
        Questions
      </span>
      <div className="flex min-h-11 items-center gap-2" role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className={STEPPER_BUTTON_CLASS_NAME}
          aria-label="Fewer questions"
          disabled={value <= min}
          onClick={() => change(value - 1)}
        >
          −
        </button>
        <input
          className="h-9 w-11 [appearance:textfield] rounded-xl border-2 border-line-strong text-center text-base font-extrabold text-ink focus:border-selected [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          aria-labelledby={labelId}
          value={draft ?? value}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitDraft();
            }
          }}
        />
        <button
          type="button"
          className={STEPPER_BUTTON_CLASS_NAME}
          aria-label="More questions"
          disabled={value >= max}
          onClick={() => change(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

const QuestionTypeCheckboxes = ({
  options,
  onChange,
}: {
  options: QuestionTypeOption[];
  onChange: (mode: AnswerMode, checked: boolean) => void;
}) => {
  const idPrefix = useId();

  return (
    <fieldset className="mt-1 border-t-2 border-line pt-1">
      <legend className="sr-only">Question types</legend>
      {options.map(({ mode, label, checked, unavailable = false }) => (
        <Fragment key={mode}>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm font-bold text-ink has-disabled:cursor-not-allowed has-disabled:opacity-50">
            <input
              type="checkbox"
              className="size-4 cursor-[inherit] accent-brand"
              checked={checked && !unavailable}
              disabled={unavailable}
              aria-describedby={unavailable ? `${idPrefix}-${mode}-unavailable` : undefined}
              onChange={(event) => onChange(mode, event.target.checked)}
            />
            {label}
          </label>
          {unavailable && (
            <span id={`${idPrefix}-${mode}-unavailable`} className="sr-only">
              Not available in this browser
            </span>
          )}
        </Fragment>
      ))}
    </fieldset>
  );
};

const PracticeSettings = ({
  questionCount,
  onQuestionCountChange,
  questionTypes,
  onQuestionTypeChange,
}: PracticeSettingsProps) => (
  <DotsMenu label="Practice settings">
    <QuestionCountStepper {...questionCount} onChange={onQuestionCountChange} />
    {questionTypes && <QuestionTypeCheckboxes options={questionTypes} onChange={onQuestionTypeChange} />}
  </DotsMenu>
);

export default PracticeSettings;
