import { useContext, useEffect, useState } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

import { ThemeContext } from './context/ThemeContext';

import ThemeToggle from './components/ThemeToggler';
import ProgressBar from './components/ProgressBar';
import useLoadCurrentTheme from '../hooks/useLoadCurrentTheme';

function Popup() {
  const { isDark } = useContext(ThemeContext);
  const [showElement, setShowElement] = useState(false);

  useLoadCurrentTheme();

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
          <Joke />
          <Quote />
          <Tracker />
          <ThemeToggle />
        </>
      )}
    </div>
  )
}

export default Popup