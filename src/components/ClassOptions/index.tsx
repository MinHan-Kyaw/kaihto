import { useTranslation } from '../../i18n';
import type { ConsonantClass, ConsonantClassId } from '../../types/learning';
import AnswerOption from '../AnswerOption';
import type { AnswerResult } from '../ResultIcon';

interface ClassOptionsProps {
  classes: ConsonantClass[];
  correctClassId: ConsonantClassId;
  selectedClassId: string;
  answered: boolean;
  onSelect: (classId: ConsonantClassId) => void;
}

const getOptionResult = (
  classId: ConsonantClassId,
  correctClassId: ConsonantClassId,
  selectedClassId: string,
  answered: boolean
): AnswerResult | null => {
  if (!answered) {
    return null;
  }
  if (classId === correctClassId) {
    return 'correct';
  }
  return classId === selectedClassId ? 'incorrect' : null;
};

const ClassOptions = ({ classes, correctClassId, selectedClassId, answered, onSelect }: ClassOptionsProps) => {
  const { t } = useTranslation();

  return (
    <ul className="grid w-full grid-cols-3 gap-3" aria-label={t('practice.groups')} role="list">
      {classes.map((consonantClass) => (
        <li key={consonantClass.id}>
          <AnswerOption
            selected={consonantClass.id === selectedClassId}
            result={getOptionResult(consonantClass.id, correctClassId, selectedClassId, answered)}
            disabled={answered}
            compact
            onSelect={() => onSelect(consonantClass.id)}
          >
            <span className="text-[1.625rem] leading-[1.3] font-extrabold">{consonantClass.group}</span>{' '}
            <span className="text-sm font-bold text-ink-muted">{t(`classes.${consonantClass.id}.shortName`)}</span>
          </AnswerOption>
        </li>
      ))}
    </ul>
  );
};

export default ClassOptions;
