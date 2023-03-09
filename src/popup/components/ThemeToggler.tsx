import { useContext } from 'react';
import { ThemeContext } from './../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className='theme-toggle' onClick={toggleTheme}>
      {isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    </div>
  );
};

export default ThemeToggle;
