import { Link, NavLink, Outlet, useLocation } from 'react-router';

import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getPathInLanguage, useTranslation } from '../../i18n';

const NAV_ITEMS = [
  { to: '/consonants', label: 'nav.consonants' },
  { to: '/vowels', label: 'nav.vowels' },
  { to: '/tones', label: 'nav.tones' },
  { to: '/practice', label: 'nav.practice' },
];

const Layout = () => {
  const { lang, t } = useTranslation();
  const { pathname, search } = useLocation();
  const otherLang = lang === 'en' ? 'my' : 'en';
  // A full page load: the language is read once, from the path, when the app starts.
  const otherLanguagePath = getPathInLanguage(`${pathname}${search}`, otherLang, import.meta.env.BASE_URL);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 h-header border-b-2 border-line bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between gap-2 px-4 py-3">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl text-xl font-extrabold text-brand no-underline"
          >
            <img className="size-9" src={assetUrl('favicon.svg')} alt="" />
            <span className="max-xs:sr-only">{t('app.name')}</span>
          </Link>
          <nav className="flex items-center" aria-label={t('nav.label')}>
            <ul className="flex sm:gap-1" role="list">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      classNames(
                        'inline-flex min-h-11 items-center rounded-xl px-1 py-2 text-xs font-bold no-underline hover:bg-brand-light hover:text-brand xs:px-2 xs:text-[0.9375rem] sm:px-3 sm:text-base',
                        isActive ? 'bg-brand-light text-brand' : 'text-ink-muted'
                      )
                    }
                  >
                    {t(label)}
                  </NavLink>
                </li>
              ))}
            </ul>
            {/* A globe on phones, where the nav leaves no room for a word; its invisible edge keeps a 44px touch target. */}
            <a
              href={otherLanguagePath}
              className="relative ml-1 inline-grid size-9 shrink-0 place-items-center rounded-xl border-2 border-line text-sm font-bold text-ink-muted no-underline after:absolute after:-inset-1 hover:bg-brand-light hover:text-brand sm:size-auto sm:min-h-11 sm:min-w-11 sm:px-2"
              aria-label={t('language.switch')}
              hrefLang={otherLang}
            >
              <svg className="size-5 sm:hidden" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <g fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="10" cy="10" r="8" />
                  <path d="M2 10h16M10 2c2.2 2.2 3.3 4.9 3.3 8s-1.1 5.8-3.3 8c-2.2-2.2-3.3-4.9-3.3-8S7.8 4.2 10 2z" />
                </g>
              </svg>
              <span className="max-sm:sr-only" lang={otherLang}>
                {t('language.other')}
              </span>
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-content flex-1 px-4 pt-6 pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
