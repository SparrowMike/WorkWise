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
  const [height, setHeight] = useState(27);
  const [isQuoteReadyToRender, setIsQuoteReadyToRender] = useState(false);

  useLoadCurrentTheme();

  useEffect(() => {
    const popupElement = document.getElementById('popup');
  
    if (popupElement) {
      const timeoutId = setTimeout(() => {
        setHeight(popupElement.scrollHeight);
        setIsQuoteReadyToRender(true);
      }, 500);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  const popupStyle = {
    height: isQuoteReadyToRender ? height : 27,
    transition: 'height 0.3s ease-in-out',
    overflow: 'hidden',
  };

  return (
    <div className="popup-container" style={popupStyle}>
      <div className={`App ${isDark ? 'dark' : 'light'}`} id="popup">
        {!isQuoteReadyToRender && <ProgressBar/>}
        <Clock />
        {/* <Joke /> */}
        <Quote />
        <Tracker />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Popup;
