import { useContext } from 'react';

import './../styles/sass/main.scss';
import { ThemeContext } from '../popup/context/ThemeContext';
import useLoadCurrentTheme from '../hooks/useLoadCurrentTheme';

export function Options() {
  const { isDark } = useContext(ThemeContext);

  useLoadCurrentTheme();
  console.log(isDark)

  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <h1>My options component</h1>
    </div>
  );
}
