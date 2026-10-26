export type Theme = 'light' | 'dark';

// index.html reads this key before the first paint; keep the two in step.
const STORAGE_KEY = 'kaihto-theme';

// The theme index.html already applied: the saved choice, else the device setting.
export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

// Applies the theme and remembers it. Storage can be unavailable (private browsing, blocked site data); the theme still
// applies for this visit.
export const setTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Not remembered; nothing else to do.
  }
};
