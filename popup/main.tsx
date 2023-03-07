import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'

import ThemeProvider from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('popup') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>,
)
