import React from 'react';
import ReactDOM from 'react-dom/client'
import { Options } from './Options';

import ThemeProvider from '../context/PreferenceContext';

const optionsElement = document.getElementById('options-root');
if (optionsElement) {
  const optionsRoot = ReactDOM.createRoot(optionsElement);
  optionsRoot.render(
    <React.StrictMode>
    <ThemeProvider>
      <Options />
    </ThemeProvider>
  </React.StrictMode>,
  );
}