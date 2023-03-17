import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

import { BrowserRouter } from 'react-router-dom';

import ThemeProvider from './context/ThemeContext';

const popupElement = document.getElementById('popup-root');
if (popupElement) {
  const popupRoot = ReactDOM.createRoot(popupElement);
  popupRoot.render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <Popup />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}