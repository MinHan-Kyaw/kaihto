import ButtonLink from '../../components/Button/ButtonLink';
import { consonantClasses, consonants } from '../../data';
import { classNames } from '../../helpers/classNames';
import { getConsonantsByClass } from '../../helpers/vocabulary';
import { useTranslation } from '../../i18n';

const HERO_LETTERS = [
  { letter: 'ก', tilt: '-rotate-4' },
  { letter: 'ข', tilt: '-translate-y-2 rotate-4' },
  { letter: 'ค', tilt: '' },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-6 flex max-w-[30rem] flex-col items-center gap-6 text-center" aria-labelledby="home-title">
      <ul className="flex gap-3" aria-hidden="true">
        {HERO_LETTERS.map(({ letter, tilt }) => (
          <li
            key={letter}
            className={classNames(
              'grid size-18 place-items-center rounded-2xl border-2 border-brand-border bg-brand-light font-thai text-[2.5rem] font-medium text-brand shadow-edge-brand-soft',
              tilt
            )}
            lang="th"
          >
            {letter}
          </li>
        ))}
      </ul>
      <h1 id="home-title" className="text-[clamp(2.25rem,8vw,3rem)] leading-[1.1] font-extrabold">
        {t('app.name')}
      </h1>
      <p className="-mt-3 text-xl text-ink-muted">{t('app.tagline')}</p>
      <div className="grid w-full gap-3">
        <ButtonLink to="/consonants" variant="secondary" fullWidth>
          {t('home.exploreConsonants')}
        </ButtonLink>
        <ButtonLink to="/vowels" variant="secondary" fullWidth>
          {t('home.exploreVowels')}
        </ButtonLink>
        <ButtonLink to="/tones" variant="secondary" fullWidth>
          {t('home.learnTones')}
        </ButtonLink>
        <ButtonLink to="/meanings" variant="secondary" fullWidth>
          {t('home.learnMeanings')}
        </ButtonLink>
        <ButtonLink to="/practice/consonants" fullWidth>
          {t('home.practiceConsonants')}
        </ButtonLink>
        <ButtonLink to="/practice/vowels" fullWidth>
          {t('home.practiceVowels')}
        </ButtonLink>
      </div>
      <ul className="mt-2 grid w-full grid-cols-3 gap-3" aria-label={t('home.classes')}>
        {consonantClasses.map((consonantClass) => (
          <li key={consonantClass.id} className="flex flex-col rounded-2xl border-2 border-line px-2 py-3">
            <span className="text-2xl font-extrabold text-brand">
              {getConsonantsByClass(consonants, consonantClass.id).length}
            </span>
            <span className="text-sm text-ink-muted">{t(`classes.${consonantClass.id}.name`)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
