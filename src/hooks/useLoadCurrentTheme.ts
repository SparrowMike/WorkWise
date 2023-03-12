import { useContext, useEffect } from 'react';
import { ThemeContext } from '../popup/context/ThemeContext';

function useLoadCurrentTheme() {
  const { toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_THEME' }, (response) => {
      if (response && response.theme !== undefined && response.theme !== null) {
        toggleTheme(response.theme);
        console.log('Loaded theme:', response.theme);
      } else {
        console.error('Error loading theme:', response);
      }
    });
  }, [toggleTheme]);

  return null;
}

export default useLoadCurrentTheme;
