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

  console.log('props', props.preference)

  useEffect(() => {
    const currentTime = new Date();
    let quoteCreatedAt = new Date();
    if (props.preference.quote?.createdAt) {
      quoteCreatedAt = props.preference.quote.createdAt;
    }

    const timeDifferenceMs = currentTime.getTime() - new Date(quoteCreatedAt).getTime();
    const timeDifferenceMin = Math.floor(timeDifferenceMs / (1000 * 60));

    console.log(timeDifferenceMin)
    const loadQuote = async (): Promise<void> => {
      if (Object.keys(props.preference).length && timeDifferenceMin >= 5) {
        await new Promise<void>((resolve) => {
          chrome.runtime.sendMessage({ type: 'LOAD_QUOTE' }, (response) => {
            if (response && response.quote) {
              const newPreference = { ...props.preference, quote: response.quote }
              setPreference(newPreference);
              chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
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
