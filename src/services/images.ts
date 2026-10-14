// Held so the browser keeps the decoded pictures for the session.
const preloadedImages: HTMLImageElement[] = [];

const whenIdle = (callback: () => void): void => {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
};

// Fetches pictures in the background once the page has loaded, so they show instantly when a screen needs them.
export const preloadImages = (sources: readonly string[]): void => {
  const load = () =>
    whenIdle(() => {
      sources.forEach((source) => {
        const image = new Image();
        image.src = source;
        preloadedImages.push(image);
      });
    });

  if (document.readyState === 'complete') {
    load();
  } else {
    window.addEventListener('load', load, { once: true });
  }
};
