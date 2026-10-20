import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import { consonants } from './data';
import { assetUrl } from './helpers/assetUrl';
import { getVocabulary } from './helpers/vocabulary';
import { getLanguageFromPath, getRouterBasename, LanguageContext } from './i18n';
import { preloadImages } from './services/images';

import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/noto-sans-thai-looped/thai-400.css';
import '@fontsource/noto-sans-thai-looped/thai-500.css';
// The Thai subset has no Latin glyphs, so the dash in "-ะ" and the brackets in "ก (ไก่)" would fall back to Nunito;
// the font's own Latin subset keeps Thai text in one typeface. Its unicode-range means it loads only when used.
import '@fontsource/noto-sans-thai-looped/latin-400.css';
import '@fontsource/noto-sans-thai-looped/latin-500.css';
import '@fontsource/noto-sans-myanmar/myanmar-400.css';
import '@fontsource/noto-sans-myanmar/myanmar-700.css';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

// English pages live under /en; the header switch reloads the page in the other language.
const lang = getLanguageFromPath(window.location.pathname, import.meta.env.BASE_URL);
document.documentElement.lang = lang;

createRoot(rootElement).render(
  <StrictMode>
    <LanguageContext value={lang}>
      <BrowserRouter basename={getRouterBasename(lang, import.meta.env.BASE_URL)}>
        <App />
      </BrowserRouter>
    </LanguageContext>
  </StrictMode>
);

preloadImages(getVocabulary(consonants).flatMap((word) => (word.image ? [assetUrl(word.image)] : [])));
