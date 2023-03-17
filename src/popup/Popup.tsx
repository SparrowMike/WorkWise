import { useContext } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Shared/Clock';

import { ThemeContext } from './context/ThemeContext';

import useLoadCurrentTheme from '../hooks/useLoadCurrentTheme';
import MainPage from './components/MainPage/MainPage';
import { Route, Routes } from "react-router-dom";

import SettingsPage from './components/SettingsPage/SettingsPage';
import ThemeToggle from './components/Shared/ThemeToggler';

function Popup() {
  const { isDark } = useContext(ThemeContext);

  useLoadCurrentTheme();
  
  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`}>
      <Clock />
      <Routes>
        <Route path="/popup.html" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      {/* <ThemeToggle /> */}
    </div>
  );
}
export default Popup;
