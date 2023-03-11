import { useContext } from 'react';
import { ThemeContext } from './../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  function updateThemePref() {
    const newTheme = !isDark;
    toggleTheme(newTheme);
    chrome.runtime.sendMessage({ type: 'UPDATE_THEME', theme: newTheme });
  }

  return (
    <div className='theme-toggle' onClick={() => updateThemePref()}>
      {isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </div>
  );
};

export default ThemeToggle;
