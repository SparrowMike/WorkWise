import { useContext } from 'react';
import './../styles/sass/main.scss';

import { PreferenceContext } from '../context/PreferenceContext';

import MainPage from './components/MainPage/MainPage';
import { Route, Routes } from "react-router-dom";

import SettingsPage from './components/SettingsPage/SettingsPage';
import useLoadPreference from '../hooks/useLoadPreference';

function Popup() {
  const { preference } = useContext(PreferenceContext);

  useLoadPreference();

  const handleClick = () => {
    window.open('https://github.com/SparrowMike/WorkWise/issues', '_blank');
  };

  return (
    <div id="Work-Wise" className={`${preference.theme || 'dark'}`}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <a className="feedback" onClick={() => handleClick()}>Feedback</a>
    </div>
  );
}
export default Popup;
