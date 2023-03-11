import { useContext, useEffect } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

import { ThemeContext } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggler';

function Popup() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_THEME' }, (response) => {
      toggleTheme(response.theme);
    })
  }, []);

  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <Clock/>
      {/* <Joke/>  */}
      <Quote/>
      <Tracker/>
      <ThemeToggle/>
    </div>
  )
}

export default Popup