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

// A level start and end, eased between them; a turning point is drawn flat at a third of the way, so the rising tone
// reads as a check mark (dip, then rise).
const getPath = (pitch: Tone['pitch']): string => {
  const [start, ...rest] = pitch.map(toY);

  if (rest.length === 1) {
    const [end] = rest;

    return `M4 ${start} C20 ${start} 28 ${end} 44 ${end}`;
  }
  const [turn, end] = rest;

  return `M4 ${start} C10 ${start} 12 ${turn} 18 ${turn} C30 ${turn} 36 ${end} 44 ${end}`;
};

const ToneContour = ({ pitch, size = 'default' }: ToneContourProps) => (
  <svg
    className={classNames('shrink-0', SIZE_CLASS_NAMES[size])}
    viewBox="0 0 48 32"
    aria-hidden="true"
    focusable="false"
    data-pitch={pitch.join('')}
    data-size={size}
  >
    {PITCH_LEVELS.map((level) => (
      <line key={level} x1="2" x2="46" y1={toY(level)} y2={toY(level)} className="stroke-line" strokeWidth="1" />
    ))}
    <path d={getPath(pitch)} className="stroke-brand" fill="none" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default ToneContour;
