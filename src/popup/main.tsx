import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

import ThemeProvider from './context/ThemeContext';

const popupElement = document.getElementById('popup-root');
if (popupElement) {
  const popupRoot = ReactDOM.createRoot(popupElement);
  popupRoot.render(
    <React.StrictMode>
     <ThemeProvider>
       <Popup />
     </ThemeProvider>
   </React.StrictMode>,
  );
}