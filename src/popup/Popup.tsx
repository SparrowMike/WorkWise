import { useContext } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

import { ThemeContext } from './context/ThemeContext';

import ThemeToggle from './components/ThemeToggler';
import useLoadCurrentTheme from '../hooks/useLoadCurrentTheme';

function Popup() {
  const { isDark } = useContext(ThemeContext);

  useLoadCurrentTheme();
  
  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <Clock />
      {/* <Joke /> */}
      <Quote />
      <Tracker />
      <ThemeToggle />
    </div>
  );
}
export default Popup;
