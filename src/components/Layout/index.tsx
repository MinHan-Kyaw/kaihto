import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';

import { assetUrl } from '../../helpers/assetUrl';
import { classNames } from '../../helpers/classNames';
import { getPathInLanguage, useTranslation } from '../../i18n';
import ThemeSwitch from '../ThemeSwitch';

const NAV_ITEMS = [
  { to: '/consonants', label: 'nav.consonants' },
  { to: '/vowels', label: 'nav.vowels' },
  { to: '/tones', label: 'nav.tones' },
  { to: '/meanings', label: 'nav.meanings' },
  { to: '/practice', label: 'nav.practice' },
];

const MENU_ID = 'main-menu';

// The icon buttons in the header; their invisible edge keeps a 44px touch target.
const ICON_BUTTON_CLASS_NAME =
  'relative inline-grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-line text-ink-muted after:absolute after:-inset-1 hover:bg-brand-light hover:text-brand';

type Theme = 'light' | 'dark';

interface LayoutProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Layout = ({ theme, onThemeChange }: LayoutProps) => {
  const { lang, t } = useTranslation();
  const { pathname, search } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const otherLang = lang === 'en' ? 'my' : 'en';
  // A full page load: the language is read once, from the path, when the app starts.
  const otherLanguagePath = getPathInLanguage(`${pathname}${search}`, otherLang, import.meta.env.BASE_URL);

  // The phone menu closes on a tap outside the header or on Escape, like the three-dot menus.
  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 h-header border-b-2 border-line bg-surface" ref={headerRef}>
        <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-3">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl text-xl font-extrabold text-brand no-underline"
          >
            <img className="size-9" src={assetUrl('favicon.svg')} alt="" />
            {/* Phones have room for the name beside the menu button; the full bar has room for it from md. */}
            <span className="sm:max-md:sr-only">{t('app.name')}</span>
          </Link>
          {/* A bar from sm; on phones a panel under the header that the menu button opens. */}
          <nav
            id={MENU_ID}
            className={classNames(
              'sm:ml-auto sm:block',
              menuOpen
                ? 'max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:border-b-2 max-sm:border-line max-sm:bg-surface max-sm:shadow-edge'
                : 'max-sm:hidden'
            )}
            aria-label={t('nav.label')}
          >
            <ul className="flex flex-col gap-1 px-4 py-2 sm:flex-row sm:p-0" role="list">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      classNames(
                        'flex min-h-12 items-center rounded-xl px-3 text-base font-bold no-underline hover:bg-brand-light hover:text-brand sm:min-h-11',
                        isActive ? 'bg-brand-light text-brand' : 'text-ink-muted'
                      )
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 max-sm:ml-auto">
            {/* A globe on phones and the language's name from sm. */}
            <a
              href={otherLanguagePath}
              className={classNames(
                ICON_BUTTON_CLASS_NAME,
                'text-sm font-bold no-underline sm:size-auto sm:min-h-11 sm:min-w-11 sm:px-2'
              )}
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
            <ThemeSwitch theme={theme} onChange={onThemeChange} />
            <button
              type="button"
              className={classNames(ICON_BUTTON_CLASS_NAME, 'sm:hidden')}
              aria-label={t('nav.menu')}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="size-5"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                data-icon={menuOpen ? 'close' : 'menu'}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  d={menuOpen ? 'M5 5l10 10M15 5L5 15' : 'M3 5h14M3 10h14M3 15h14'}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-content flex-1 px-4 pt-6 pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
