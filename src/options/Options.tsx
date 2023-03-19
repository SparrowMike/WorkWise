import { useContext } from 'react';

import './../styles/sass/main.scss';
import { PreferenceContext } from '../context/PreferenceContext';
import useLoadPreference from '../hooks/useLoadPreference';

export function Options() {
  const { preference } = useContext(PreferenceContext);

  useLoadPreference();

  return (
    <div id="Work-Wise" className={`${preference.theme || 'dark'}`}>
      <h1>My options component</h1>
    </div>
  );
}
