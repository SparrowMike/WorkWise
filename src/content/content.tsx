import { useState, useEffect, useRef } from 'react';
import Blob from './components/Blob';
import useIsMounted from '../hooks/useIsMounted';
import { Preference, RemindersInterface } from '../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { countdown } from '../utils/countdown';
import Time from '../popup/components/Shared/Time';
import CurrentDate from '../popup/components/Shared/Date';

interface MessageRequest {
  type: string;
  preference?: Preference;
  isActive?: boolean;
  reminders: RemindersInterface[]
}

interface ContentProps {
  data: Preference;
  reminders: RemindersInterface[];
}

const Content = (props: ContentProps) => {
  useIsMounted(); // checks if react mounted 

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [preference, setPreference] = useState<Preference>(props.data);
  const [reminders, setReminders] = useState<RemindersInterface[]>(props.reminders)

  // ! ======TBC====== REFACTORING NEEDED IN OTHER COMPONENTS SO THEY LISTEN FOR UPDATES
  useEffect(() => {
    const handleMessage = (
      request: MessageRequest,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.type === 'BLOB_ACTIVATED' && request.preference || request.isActive) {
        setPreference({...preference, ...request.preference, isActive: request.isActive});
        if (request.reminders) {
          setReminders(request.reminders)
        }
      }
      
      // ! FIX ON FOCUS WHEN BLOB TRIGGERED
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

      const reminder: RemindersInterface = {
        title: inputValue,
        description: '',
        priority: 1,
        reminder: true
      }
      
      const updatedReminders = [ reminder, ...reminders];
      const trimmedValue = inputValue.trim();
      const id = uuidv4();

      if (trimmedValue !== '') {
        chrome.runtime.sendMessage('', { type: 'SAVE_REMINDERS', reminders: updatedReminders });
        setReminders(updatedReminders);
        setInputValue('');
      }

      // ! ======TBC===== need refactoring - once full data available in SEND_REMINDER updated the preference to isActive = false.
      // const container = document.getElementById('work-wise__content')
      // if (container?.classList.contains('input-active')) {
      //   container.classList.remove('input-active')
      // }

      // Start countdown
      countdown(preference.sprintTiming || 10, id); //! You can stack up the countdown event causing it to just go nuts, we need new approach
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  //! ====TBC==== extract Date and Time to individual components ?

  if (preference.hideBlob) {
    return null;
  }

  return (
    <div>
      <div id="work-wise__content-container">
        <div id="work-wise__input-wrapper">
          {preference.showTime && <Time />}
          {preference.showDate && <CurrentDate />}

          {preference.showReminder &&
            <div>
              {reminders[0]?.title || ''}
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