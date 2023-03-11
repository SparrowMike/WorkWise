import { useContext, useEffect } from 'react';

import './../styles/sass/main.scss';
import { ThemeContext } from '../popup/context/ThemeContext';

export function Options() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_THEME' }, (response) => {
      toggleTheme(response.theme);
    })
  }, []);

  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <h1>My options component</h1>
    </div>
  );
}
