import { useContext, useEffect, useState } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

import { ThemeContext } from './context/ThemeContext';

import ThemeToggle from './components/ThemeToggler';
import ProgressBar from './components/ProgressBar';

function Popup() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_THEME' }, (response) => {
      toggleTheme(response.theme);
    })
  }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowElement(true);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      {!showElement ? (
        <ProgressBar />
      ) : (
        <>
          <Clock />
          {/* <Joke /> */}
          <Quote />
          <Tracker />
          <ThemeToggle />
        </>
      )}
    </div>
  )
}

export default Popup