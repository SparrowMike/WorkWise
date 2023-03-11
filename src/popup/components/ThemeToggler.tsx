import { useContext } from 'react';
import { ThemeContext } from './../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  function updateThemePref() {
    toggleTheme(!isDark);
    chrome.runtime.sendMessage({ type: 'UPDATE_THEME', theme: !isDark });
  }

  return (
    <div className='theme-toggle' onClick={() => updateThemePref()}>
      {isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </div>
  );
};

export default ThemeToggle;
