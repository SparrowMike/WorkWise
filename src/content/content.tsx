import { useState, useEffect, useRef } from 'react';
import Blob from './components/Blob';
import useIsMounted from '../hooks/useIsMounted';
import { PreferenceInterface, ReminderInterface } from '../interfaces/user';
import { v4 as uuidv4 } from 'uuid';
import { countdown } from '../utils/countdown';
import Time from '../popup/components/Shared/Time';
import CurrentDate from '../popup/components/Shared/Date';

interface MessageRequest {
  type: string;
  preference?: PreferenceInterface;
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
  const [countdownInfo, setCountdownInfo] = useState<countdownInterface>();

  // ! ======TBC====== REFACTORING NEEDED IN OTHER COMPONENTS SO THEY LISTEN FOR UPDATES
  useEffect(() => {
    const handleMessage = (
      request: MessageRequest,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (request.type === 'BLOB_DATA_UPDATE' && request.preference || request.isActive) {
        setPreference({...preference, ...request.preference, isActive: request.isActive});
        if (request.reminders) {
          setReminders(request.reminders)
        }
        sendResponse({status: true});
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

  // useEffect(() => {
  //   return () => {
      // ! will trigger sync timeout as it stacks up 
      // chrome.runtime.sendMessage({ type: "UDPATE_REMINDER_TIMELEFT", id: countdownInfo?.id, timeLeft: countdownInfo?.timeLeft });
  //   }
  // }, [countdownInfo]);


  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      const id = uuidv4();

      const reminder: ReminderInterface = {
        id,
        title: inputValue,
        description: '',
        priority: 1,
        createdAt: new Date,
        reminder: true
      }

      const updatedReminders = [ reminder, ...reminders];
      const trimmedValue = inputValue.trim();

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
      countdown(preference.sprintTiming || 10, (timeLeft) => {
        setCountdownInfo({
          id,
          timeLeft
        });
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

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