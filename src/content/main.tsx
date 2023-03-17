import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBlob } from './helpers/interactiveBlob';
import './../styles/sass/content.scss';
import Content from './Content';

createBlob(); // creates the parent element for the this instance of react

const optionsElement = document.getElementById('work-wise__content');
if (optionsElement) {
  const optionsRoot = ReactDOM.createRoot(optionsElement);
  optionsRoot.render(
    <React.StrictMode>
      <Content/>
    </React.StrictMode> 
  );
}