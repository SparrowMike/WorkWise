import { useState, useEffect, useRef } from 'react';
import Blob from './components/Blob';
import useIsMounted from '../hooks/useIsMounted';
import { PreferenceInterface, ReminderInterface } from '../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { countdown } from '../utils/countdown';
import Time from '../popup/components/Shared/Time';
import CurrentDate from '../popup/components/Shared/Date';
import { getTimeLeft } from '../utils/getTimeLeft';

interface MessageRequest {
  type: string;
  preference: PreferenceInterface;
  isActive?: boolean;
  reminders: ReminderInterface[]
}

interface countdownInterface {
  id: string;
  timeLeft: number;
}

interface ContentProps {
  data: PreferenceInterface;
  reminders: ReminderInterface[];
}

const Content = (props: ContentProps) => {
  useIsMounted(); // checks if react mounted 

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [preference, setPreference] = useState<PreferenceInterface>(props.data);
  const [reminders, setReminders] = useState<ReminderInterface[]>(props.reminders);
  const [timeLeft, setTimeLeft] = useState('');
  // const [countdownInfo, setCountdownInfo] = useState<countdownInterface>();

  // ! ======TBC====== REFACTORING NEEDED IN OTHER COMPONENTS SO THEY LISTEN FOR UPDATES
  useEffect(() => {
    const handleMessage = (
      request: MessageRequest,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.type === 'BLOB_DATA_UPDATE' && request.preference || request.isActive) {
        setPreference({ ...request.preference, isActive: request.isActive });
        if (request.reminders) {
          setReminders(request.reminders)
        }
        sendResponse({ status: true });
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    const updateRemainingTime = () => {
      const timeLeft = getTimeLeft(new Date(reminders[0]?.createdAt), preference.sprintTiming);
      if (reminders[0]) {
        setTimeLeft(timeLeft);
      }
      const blob = document.getElementById('work-wise__blobSvg');
  
      if (blob?.classList.contains('active')) {
        blob?.classList.remove('active');
      }
  
      if (timeLeft === '00:00' && !blob?.classList.contains('active')) {
        blob?.classList.add('active');
        clearInterval(intervalId);
      }

      if (!reminders.length) {
        clearInterval(intervalId);
      }
    };

    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [reminders[0]?.createdAt, preference.sprintTiming]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      const id = uuidv4();

      const reminder: ReminderInterface = {
        // id,
        title: inputValue,
        description: '',
        priority: 1,
        createdAt: new Date,
        reminder: true
      }

      const updatedReminders = [reminder, ...reminders];
      const trimmedValue = inputValue.trim();

      if (trimmedValue !== '') {
        chrome.runtime.sendMessage('', { type: 'SAVE_REMINDERS', reminders: updatedReminders });
        setReminders(updatedReminders);
        setInputValue('');
      }

      // Start countdown
      // countdown(preference.sprintTiming || 10, (timeLeft) => {
      //   setCountdownInfo({
      //     id,
      //     timeLeft
      //   });
      // });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  if (preference.hideBlob) {
    return null;
  }

  return (
    <div className={`${preference.theme || 'dark'}`}>
      <div id="work-wise__content-container">
        <div id="work-wise__input-wrapper">
          {preference.showTime && <Time />}
          {preference.showDate && <CurrentDate />}

          {preference.showReminder &&
            <div className='reminder'>
              {reminders[0]?.title || ''}
            </div>
          }
          <input
            id="work-wise__my-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onKeyUp={handleKeyUp}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>
      {reminders[0] && timeLeft && <div className='time-left'>{timeLeft}</div>}
      <Blob />
    </div>
  );
};

export default Content;