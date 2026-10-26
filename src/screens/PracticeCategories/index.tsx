import { Link } from 'react-router';

import { consonants, vowels } from '../../data';
import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getVocabulary } from '../../helpers/vocabulary';
import { isCombinable } from '../../helpers/vowels';
import { useTranslation } from '../../i18n';

const vocabulary = getVocabulary(consonants);

const TILTS = ['-rotate-4', '-translate-y-2 rotate-3', 'rotate-2'];

// Pictures of ก ข ค for consonants; words that show off vowels (-า, -ู, เ-ือ) for vowels.
const CATEGORIES = [
  {
    to: '/practice/consonants',
    title: 'practice.categories.consonants',
    detail: 'practice.categories.consonantsDetail',
    count: consonants.length,
    words: ['ก-ไก่', 'ข-ไข่', 'ค-ควาย'],
    showLetter: true,
  },
  {
    to: '/practice/vowels',
    title: 'practice.categories.vowels',
    detail: 'practice.categories.vowelsDetail',
    count: vowels.filter(isCombinable).length,
    words: ['ป-ปลา', 'ง-งู', 'ส-เสือ'],
    showLetter: false,
  },
];

const PracticeCategories = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="practice-categories-title">
      <h1 id="practice-categories-title" className="text-[1.75rem] font-extrabold">
        {t('practice.title')}
      </h1>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2" role="list">
        {CATEGORIES.map(({ to, title, detail, count, words, showLetter }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex h-full flex-col items-center gap-2 rounded-3xl border-2 border-line px-4 pt-8 pb-6 text-center text-ink no-underline shadow-edge transition-[transform,background-color] duration-150 hover:bg-brand-light active:translate-y-[3px] xs:px-6"
            >
              <span className="mb-2 flex gap-2 xs:gap-3" aria-hidden="true">
                {vocabulary
                  .filter((word) => words.includes(word.id))
                  .map((word, position) => (
                    <span
                      key={word.id}
                      className={classNames(
                        'flex w-18 flex-col items-center gap-1 rounded-2xl border-2 border-brand-border bg-surface p-2 shadow-edge-brand-soft xs:w-20',
                        TILTS[position]
                      )}
                    >
                      {word.image && <img className="size-12 drop-shadow-picture xs:size-14" src={assetUrl(word.image)} alt="" />}
                      <span className="font-thai text-lg leading-tight font-medium text-brand" lang="th">
                        {showLetter ? word.consonant : word.thai}
                      </span>
                    </span>
                  ))}
              </span>
              <span className="text-[1.375rem] font-extrabold">{t(title)}</span>{' '}
              <span className="text-ink-muted">{t(detail, { count })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PracticeCategories;
