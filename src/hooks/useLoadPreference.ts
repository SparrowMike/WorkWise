import { useContext, useEffect } from 'react';
import { PreferenceContext } from '../context/PreferenceContext';

const defaultPreference = {
  theme: "light",
  showReminder: true,
  stickyBlob: false,
  hideBlob: false,
  showTime: true,
  showDate: true,
  sprintTiming: 5,
  blobPosition: {
    x: 0,
    y: 0,
  },
};

function useLoadPreference() {
  const { preference, setPreference } = useContext(PreferenceContext);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'LOAD_PREFERENCE' }, (response) => {
      if (response && response.preference !== undefined && response.preference !== null) {
        const newPreference = { ...defaultPreference, ...response.preference };
        setPreference(newPreference);
        console.log('Loaded preference');
      } else {
        console.error('Error loading preference:', response);
        setPreference(defaultPreference);
        console.log('Set default preference:', defaultPreference);
      }
    });
  }, []);

  return null;
}

export default useLoadPreference;
