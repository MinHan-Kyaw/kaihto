import { render } from '@testing-library/react';

import ToneContour from '.';

describe('ToneContour', () => {
  it('draws the pitch from start to end, hidden from screen readers', () => {
    const { container } = render(<ToneContour pitch={[1, 4]} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-pitch', '14');
    expect(svg?.querySelector('path')).toHaveAttribute('d', 'M4 28 C20 28 28 10 44 10');
    expect(svg).toHaveAttribute('data-size', 'default');
  });

  describe('given a turning point', () => {
    it('dips to it before rising to the end', () => {
      const { container } = render(<ToneContour pitch={[2, 1, 4]} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-pitch', '214');
      expect(svg?.querySelector('path')).toHaveAttribute('d', 'M4 22 C10 22 12 28 18 28 C30 28 36 10 44 10');
    });
  });

  describe('given the small size', () => {
    it('draws the same pitch', () => {
      const { container } = render(<ToneContour pitch={[1, 4]} size="small" />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('data-size', 'small');
      expect(svg).toHaveAttribute('data-pitch', '14');
    });
  });
});
