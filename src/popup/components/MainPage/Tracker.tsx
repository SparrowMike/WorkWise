import { useState, useEffect, useContext } from "react";
import { getTimeLeft } from "../../../utils/getTimeLeft";
import { ReminderInterface } from "../../../interfaces/user";
import { PreferenceContext } from "../../../context/PreferenceContext";

function Tracker() {
  const ReminderInterface: ReminderInterface = {
    id: '',
    title: '',
    description: '',
    priority: 0,
    reminder: false,
    createdAt: new Date(),
    isFocused: false,
  };

  const [taskArray, setTaskArray] = useState<ReminderInterface[]>([]);
  const [task, setTask] = useState<ReminderInterface>(ReminderInterface);
  const [backupTrigger, setBackupTrigger] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const { preference } = useContext(PreferenceContext);

  const handleOptionsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  useEffect(() => {
    if (!taskArray.length) {
      chrome.runtime.sendMessage({ type: 'LOAD_REMINDERS' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          if (response && response.reminders) {
            setTaskArray(response.reminders);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (backupTrigger) {
      backUpData();
      setBackupTrigger(false);
    }
  }, [backupTrigger, taskArray]);

  function backUpData() {
    chrome.runtime.sendMessage('', { type: 'SAVE_REMINDERS', reminders: taskArray });
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    if (!task.title.length) return;

    setTaskArray([task, ...taskArray])
    setTask(ReminderInterface);
    setBackupTrigger(true);

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setTask({ ...task, [name]: value, createdAt: new Date() });
  }

  function handleDueTimeUpdate(arr: ReminderInterface[]) {
    const updatedTaskArray = [...arr];
    if (updatedTaskArray.length) {
      updatedTaskArray[0].createdAt = new Date();
    }
    setTaskArray(updatedTaskArray);
    setBackupTrigger(true);
  };

  function handleTaskDelete(index: number) {
    const updatedArr = taskArray.filter((_, i) => index !== i)
    setTaskArray(updatedArr);
    if (index === 0) {
      handleDueTimeUpdate(updatedArr);
    }
    setBackupTrigger(true);
  }


  function handleFocus(index: number) {
    setTaskArray((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, isFocused: true } : item))
    );
  }

  const handleItemUpdate = (index: number, value: string | null, name: string) => {
    if (!value?.length) {
      handleTaskDelete(index);
      return;
    }

    setTaskArray((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, [name]: value, isFocused: false } : item))
    );
    setBackupTrigger(true);
  };

  const updateRemainingTime = () => {
    const timeLeft = getTimeLeft(new Date(taskArray[0]?.createdAt), preference.sprintTiming);
    if (taskArray[0]) {
      setTimeLeft(timeLeft);
    }
  };

  useEffect(() => {
    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [taskArray[0]?.createdAt]);

  return (
    <div className="tracker">
      <div className="container">
        <form className="input" onSubmit={handleSubmit}>
          {(taskArray[0] && !timeLeft.includes('NaN')) &&
            <div className="timing-tracker">
              <h4 className="time">Remaining time: <span>{timeLeft}</span></h4>
              <div className="actions">
                <div className="completed icon" onClick={() => handleTaskDelete(0)}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5002 25.6666H17.5002C23.3335 25.6666 25.6668 23.3333 25.6668 17.4999V10.4999C25.6668 4.66659 23.3335 2.33325 17.5002 2.33325H10.5002C4.66683 2.33325 2.3335 4.66659 2.3335 10.4999V17.4999C2.3335 23.3333 4.66683 25.6666 10.5002 25.6666Z" stroke="var(--primary-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.0415 13.9999L12.3432 17.3016L18.9582 10.6982" stroke="var(--primary-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="repeat icon" onClick={() => handleDueTimeUpdate(taskArray)}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9.95996H17.6333C18.6717 9.95996 19.5 10.8 19.5 11.8266V13.8916" stroke="var(--primary-1)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.9717 8L9 9.96L10.9717 11.9317M19.5 18.5H10.8667C9.82833 18.5 9 17.66 9 16.6333V14.5683" stroke="var(--primary-1)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5283 20.46L19.5 18.5L17.5283 16.5283" stroke="var(--primary-1)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.4 26H17.6C23.6 26 26 23.6 26 17.6V10.4C26 4.4 23.6 2 17.6 2H10.4C4.4 2 2 4.4 2 10.4V17.6C2 23.6 4.4 26 10.4 26Z" stroke="var(--primary-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          }
          <input
            id="work-wise__my-input"
            type="text"
            name="title"
            placeholder="What's your next focus?"
            value={task.title}
            onChange={(event) => handleChange(event)}
            autoComplete="off"
          />
        </form>
      </div>
      <div className="reminders container">
        {taskArray.length ? taskArray?.map((task, index) => (
          <div key={index} className={`reminder ${task.isFocused && 'focused'}`}>
            <h4 className={`title t-${index}`} 
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => handleItemUpdate(index, event.target.textContent, 'title')}
              onFocus={() => handleFocus(index)}>
              {task.title}
            </h4>
            <div className="delete" onClick={() => handleTaskDelete(index)}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6985 17.3016L17.3018 10.6983M17.3018 17.3016L10.6985 10.6983M10.5002 25.6666H17.5002C23.3335 25.6666 25.6668 23.3333 25.6668 17.4999V10.4999C25.6668 4.66659 23.3335 2.33325 17.5002 2.33325H10.5002C4.66683 2.33325 2.3335 4.66659 2.3335 10.4999V17.4999C2.3335 23.3333 4.66683 25.6666 10.5002 25.6666Z" stroke="var(--primary-1)" fill="var(--background-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )) :
          <div className="none">
            <h4>
              No reminders
            </h4>
          </div>}
      </div>
      {/* ====   no plans for options in the MVP   ==== */}
      {/* <a onClick={handleOptionsClick} style={{ alignSelf: 'baseline', padding: '10px 5px', textDecoration: 'underline', cursor: 'pointer' }}>Options</a> */}
    </div>
  )
}

export default Tracker