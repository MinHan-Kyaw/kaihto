import { getTheme, setTheme } from './theme';

describe('theme', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('reads the theme index.html applied', () => {
    document.documentElement.dataset.theme = 'dark';

    expect(getTheme()).toBe('dark');
  });

  describe('given no theme was applied', () => {
    it('falls back to light', () => {
      expect(getTheme()).toBe('light');
    });
  });

  it('applies the theme and remembers it', () => {
    setTheme('dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('kaihto-theme')).toBe('dark');
  });

  describe('given storage is unavailable', () => {
    it('still applies the theme', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      setTheme('dark');

      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });
});
