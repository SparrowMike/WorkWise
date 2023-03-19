import { useContext, useEffect } from 'react';
import { PreferenceContext } from '../context/PreferenceContext';

function useLoadPreference() {
  const { setPreference } = useContext(PreferenceContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_PREFERENCE' }, (response) => {
      if (response && response.preference !== undefined && response.preference !== null) {
        const newPreference = { ...response.preference };
        setPreference(newPreference);
        console.log('Loaded preference');
      } else {
        console.error('Error loading preference:', response);
      }
    });
  }, []);

  return null;
}

export default useLoadPreference;
