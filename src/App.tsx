import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import Layout from './components/Layout';
import Consonants from './screens/Consonants';
import Home from './screens/Home';
import Meanings from './screens/Meanings';
import Practice from './screens/Practice';
import PracticeCategories from './screens/PracticeCategories';
import Tones from './screens/Tones';
import VowelPractice from './screens/VowelPractice';
import Vowels from './screens/Vowels';
import { getTheme, setTheme, type Theme } from './services/theme';

const App = () => {
  const [theme, setThemeState] = useState<Theme>(getTheme);

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  return (
    <Routes>
      <Route path="all" element={<Navigate to="/consonants/all" replace />} />
      <Route element={<Layout theme={theme} onThemeChange={handleThemeChange} />}>
        <Route index element={<Home />} />
        <Route path="consonants" element={<Consonants />} />
        <Route path="consonants/all" element={<Consonants showAll />} />
        <Route path="vowels" element={<Vowels />} />
        <Route path="vowels/all" element={<Vowels showAll />} />
        <Route path="tones" element={<Tones />} />
        <Route path="meanings" element={<Meanings />} />
        <Route path="meanings/text" element={<Meanings showText />} />
        <Route path="practice" element={<PracticeCategories />} />
        <Route path="practice/consonants" element={<Practice />} />
        <Route path="practice/vowels" element={<VowelPractice />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
