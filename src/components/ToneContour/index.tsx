import { classNames } from '../../helpers/classNames';
import type { Tone } from '../../types/learning';

type ContourSize = 'default' | 'small';

interface ToneContourProps {
  pitch: Tone['pitch'];
  size?: ContourSize;
}

const SIZE_CLASS_NAMES: Record<ContourSize, string> = {
  default: 'h-8 w-12',
  small: 'h-5 w-7.5',
};

const PITCH_LEVELS = [1, 2, 3, 4, 5];

// Pitch 5 is drawn at the top of the 48 × 32 box, pitch 1 at the bottom.
const toY = (level: number) => 28 - (level - 1) * 6;

const ToneContour = ({ pitch: [start, end], size = 'default' }: ToneContourProps) => (
  <svg
    className={classNames('shrink-0', SIZE_CLASS_NAMES[size])}
    viewBox="0 0 48 32"
    aria-hidden="true"
    focusable="false"
    data-pitch={`${start}${end}`}
    data-size={size}
  >
    {PITCH_LEVELS.map((level) => (
      <line key={level} x1="2" x2="46" y1={toY(level)} y2={toY(level)} className="stroke-line" strokeWidth="1" />
    ))}
    <path
      d={`M4 ${toY(start)} C20 ${toY(start)} 28 ${toY(end)} 44 ${toY(end)}`}
      className="stroke-brand"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export default ToneContour;
