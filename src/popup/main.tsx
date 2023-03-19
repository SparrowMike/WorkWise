import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

import { BrowserRouter } from 'react-router-dom';

import PreferenceProvider from '../context/PreferenceContext';

const popupElement = document.getElementById('popup-root');
if (popupElement) {
  const popupRoot = ReactDOM.createRoot(popupElement);
  popupRoot.render(
    <React.StrictMode>
      <BrowserRouter>
        <PreferenceProvider>
          <Popup />
        </PreferenceProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}