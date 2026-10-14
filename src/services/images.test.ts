import { preloadImages } from './images';

class FakeImage {
  static instances: FakeImage[] = [];

  src = '';

  constructor() {
    FakeImage.instances.push(this);
  }
}

describe('images service', () => {
  beforeEach(() => {
    FakeImage.instances = [];
    vi.stubGlobal('Image', FakeImage);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('given the page has loaded', () => {
    it('fetches every picture once the browser is idle', () => {
      preloadImages(['/images/words/kai.svg', '/images/words/khai.svg']);

      expect(FakeImage.instances).toHaveLength(0);

      vi.runAllTimers();

      expect(FakeImage.instances.map((image) => image.src)).toEqual(['/images/words/kai.svg', '/images/words/khai.svg']);
    });
  });

  describe('given the page is still loading', () => {
    it('waits for the load event so the first screen loads first', () => {
      vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');

      preloadImages(['/images/words/kai.svg']);
      vi.runAllTimers();

      expect(FakeImage.instances).toHaveLength(0);

      window.dispatchEvent(new Event('load'));
      vi.runAllTimers();

      expect(FakeImage.instances.map((image) => image.src)).toEqual(['/images/words/kai.svg']);
    });
  });
});
