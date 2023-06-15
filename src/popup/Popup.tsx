import { useContext, useEffect, useState } from 'react';
import './../styles/sass/main.scss';

import { PreferenceContext } from '../context/PreferenceContext';

import MainPage from './components/MainPage/MainPage';
import { Route, Routes } from "react-router-dom";

import SettingsPage from './components/SettingsPage/SettingsPage';
import { PreferenceInterface, ReminderInterface } from '../interfaces/user';
import { RemindersContext } from '../context/RemindersContext';

interface Props {
  preference: PreferenceInterface,
  reminders: ReminderInterface[]
}

function Popup(props: Props) {
  const { preference, setPreference } = useContext(PreferenceContext);
  const { setReminders } = useContext(RemindersContext);

  useEffect(() => {
    setPreference(props.preference);
    setReminders(props.reminders)
  }, [props.preference, props.reminders]);

  useEffect(() => {
    const loadQuote = async (): Promise<void> => {
      if (Object.keys(props.preference).length && !props.preference.quote?.text) {
        await new Promise<void>((resolve) => {
          chrome.runtime.sendMessage({ type: 'LOAD_QUOTE' }, (response) => {
            if (response && response.quote !== undefined && response.quote !== null) {
              setPreference({ ...props.preference, quote: response.quote });
            }
            resolve();
          });
        });
      }
    };
  
    loadQuote();
  }, []);

  const handleClick = () => {
    window.open('https://github.com/SparrowMike/WorkWise/issues', '_blank');
  };

  return (
    <div id="Work-Wise" className={`${preference.theme || 'dark'}`}>
      {/* {!preference.blobLoaded && <div className="no-blob-available"></div>} */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <a className="feedback" onClick={() => handleClick()}>Feedback</a>
    </div>
  );
}
export default Popup;
