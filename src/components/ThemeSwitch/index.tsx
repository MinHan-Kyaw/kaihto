import { useTranslation } from '../../i18n';

type Theme = 'light' | 'dark';

interface ThemeSwitchProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

// A moon in light mode, a sun in dark mode; pressed means dark. Its invisible edge keeps a 44px touch target.
const ThemeSwitch = ({ theme, onChange }: ThemeSwitchProps) => {
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="relative ml-0.5 inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-xl border-2 border-line text-ink-muted after:absolute after:-inset-1.5 hover:bg-brand-light hover:text-brand sm:ml-1 sm:size-11"
      aria-label={t('theme.dark')}
      aria-pressed={isDark}
      onClick={() => onChange(isDark ? 'light' : 'dark')}
    >
      <svg className="size-5" viewBox="0 0 20 20" aria-hidden="true" focusable="false" data-icon={isDark ? 'sun' : 'moon'}>
        {isDark ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
          </g>
        ) : (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z"
          />
        )}
      </svg>
    </button>
  );
};

export default ThemeSwitch;
