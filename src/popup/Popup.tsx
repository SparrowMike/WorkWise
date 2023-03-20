import { useContext } from 'react';
import './../styles/sass/main.scss';

import Clock from './components/Shared/Clock';

import { PreferenceContext } from '../context/PreferenceContext';

import MainPage from './components/MainPage/MainPage';
import { Route, Routes } from "react-router-dom";

import SettingsPage from './components/SettingsPage/SettingsPage';
import useLoadPreference from '../hooks/useLoadPreference';

function Popup() {
  const { preference } = useContext(PreferenceContext);
  
  useLoadPreference();
  
  return (
    <div id="Work-Wise" className={`${preference.theme || 'dark'}`}>
      <Clock />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}
export default Popup;
