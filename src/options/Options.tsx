import { useContext } from 'react';

import './../styles/sass/main.scss';
import { PreferenceContext } from '../context/PreferenceContext';

export function Options() {

  return (
    <div id="Work-Wise" className={`${preference.theme || 'dark'}`}>
      <h1>My options component</h1>
    </div>
  );
}
