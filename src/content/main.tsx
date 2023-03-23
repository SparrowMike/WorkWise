import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBlob } from './helpers/interactiveBlob';
import './../styles/sass/content.scss';
import Content from './content';

import { preferenceReady, remindersReady } from '../background/background';
import { PreferenceInterface, ReminderInterface } from '../interfaces/user';

(async function () {
  const preference = await (preferenceReady as Promise<PreferenceInterface>);
  const reminders = await (remindersReady as Promise<ReminderInterface[]>);

  createBlob(); //? creates the parent element for the this instance of react

  const optionsElement = document.getElementById('work-wise__content');
  if (optionsElement) {
    const optionsRoot = ReactDOM.createRoot(optionsElement);
    optionsRoot.render(
      <React.StrictMode>
        <Content data={preference} reminders={reminders} />
      </React.StrictMode>
    );
  }
})();
