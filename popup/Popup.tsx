import { useContext } from 'react';
import './../styles/css/style.css';
import Clock from './components/Clock';
import Joke from './components/Joke';
import Tracker from './components/Tracker';
import Quote from './components/Quote';

import { ThemeContext } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggler';

function Popup() {
  const { isDark } = useContext(ThemeContext);

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
