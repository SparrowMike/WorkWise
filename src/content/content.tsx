import { useState, useEffect, useRef } from 'react';
import Blob from './components/Blob';
import Clock from '../popup/components/Clock';
import useIsMounted from '../hooks/useIsMounted';
import { Preference } from '../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { countdown } from '../utils/countdown';

interface MessageRequest {
  type: string;
  preference?: Preference;
}

const Content = () => {
  useIsMounted(); // checks if react mounted 

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [preference, setPreference] = useState<Preference>({
    theme: true,
    reminder: 'daily',
    isActive: false,
    showReminder: false,
    sprintLength: 5,
  });

  // ! ============ REFACTORING NEEDED IN OTHER COMPONENTS SO THEY LISTEN FOR UPDATES
  useEffect(() => {
    const handleMessage = (
      request: MessageRequest,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.type === 'BLOB_ACTIVATED' && request.preference) {
        setPreference(request.preference);
      }

      // if (inputRef.current) {
      //   inputRef.current.focus();
      // }
    };
  
    chrome.runtime.onMessage.addListener(handleMessage);
  
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue !== '') {
        const id = uuidv4();
        chrome.runtime.sendMessage({ type: 'SAVE_REMINDER', id, title: trimmedValue, timeLeft: 60 });

        setInputValue('');
        setPreference({...preference, reminder: inputValue});

        // document.getElementById('work-wise__content')?.classList.remove('input-active'); //! somehow this doesn't work as expected and element unable to open up 

        // Start countdown
        // countdown(preference.sprintLength || 10, id); //! You can stack up the countdown event causing it to just go nuts, we need new approach
      }
    }
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <div id="work-wise__content-container">
        <div id="work-wise__input-wrapper">
          <Clock />
          {preference.showReminder &&
            <div>
              {preference.reminder}
            </div>
          }
          <input
            id="work-wise__my-input"
            // ref="inputRef"
            type="text"
            value={inputValue}
            onKeyUp={handleKeyUp}
            onChange={handleChange}
          />
        </div>
      </div>
      <Blob />
    </div>
  );
};

export default Content;