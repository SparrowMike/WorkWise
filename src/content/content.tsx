import { useState, useEffect, useCallback } from 'react';
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
      console.log(request);
      if (request.type === 'BLOB_ACTIVATED' && request.preference) {
        setPreference(request.preference); // Use type assertion here as isActive is optional in MessageRequest
      }
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
        
        // Start countdown
        countdown(preference.sprintLength || 10, id);
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