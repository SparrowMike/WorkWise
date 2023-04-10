import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

import { BrowserRouter } from 'react-router-dom';

import PreferenceProvider from '../context/PreferenceContext';

import { preferenceReady, remindersReady } from '../background/background';
import { PreferenceInterface, ReminderInterface } from '../interfaces/user';
import RemindersProvider from '../context/RemindersContext';

(async function () {
  const preference = await (preferenceReady as Promise<PreferenceInterface>);
  const reminders = await (remindersReady as Promise<ReminderInterface[]>);

  const popupElement = document.getElementById('popup-root');
  if (popupElement) {
    const popupRoot = ReactDOM.createRoot(popupElement);
    popupRoot.render(
      <React.StrictMode>
        <BrowserRouter basename="popup.html">
          <PreferenceProvider>
            <RemindersProvider>
              <Popup preference={preference} reminders={reminders} />
            </RemindersProvider>
          </PreferenceProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
  }
})();