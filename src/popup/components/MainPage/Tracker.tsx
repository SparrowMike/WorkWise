import { useState, useEffect, useContext } from "react";
import { getTimeLeft } from "../../../utils/getTimeLeft";
import { ReminderInterface } from "../../../interfaces/user";
import { PreferenceContext } from "../../../context/PreferenceContext";
import { RemindersContext } from "../../../context/RemindersContext";

import Complete from './../../../assets/svg/complete.svg';
import Repeat from './../../../assets/svg/reload.svg';
import Delete from './../../../assets/svg/delete.svg';

function Tracker() {
  const initialReminder: ReminderInterface = {
    id: '',
    title: '',
    description: '',
    priority: 0,
    reminder: false,
    createdAt: new Date(),
    isFocused: false,
  };

  const { preference } = useContext(PreferenceContext);
  const { reminders, setReminders } = useContext(RemindersContext);

  const [task, setTask] = useState<ReminderInterface>(initialReminder);
  const [backupTrigger, setBackupTrigger] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');


  // const handleOptionsClick = () => {
  //   chrome.runtime.openOptionsPage();
  // };

  useEffect(() => {
    if (backupTrigger) {
      backUpData();
      setBackupTrigger(false);
    }
  }, [backupTrigger, reminders]);

  function backUpData() {
    chrome.runtime.sendMessage('', { type: 'SAVE_REMINDERS', reminders: reminders });
  }

  function handleSubmit(event: any) {
    event.preventDefault();

    if (!task.title.length) return;

    setReminders([task, ...reminders])
    setTask(initialReminder);
    setBackupTrigger(true);

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
  
    setTask({ ...task, [name]: value, createdAt: new Date() });
  }
  
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === 13) {
      const target = event.target as HTMLInputElement;
      target.blur();
    }
  }

  function handleDueTimeUpdate(arr: ReminderInterface[]) {
    const updatedTaskArray = [...arr];
    if (updatedTaskArray.length) {
      updatedTaskArray[0].createdAt = new Date();
    }
    setReminders(updatedTaskArray);
    setBackupTrigger(true);
  };

  function handleTaskDelete(index: number) {
    const updatedArr = reminders.filter((_, i) => index !== i)
    setReminders(updatedArr);
    if (index === 0) {
      handleDueTimeUpdate(updatedArr);
    }
    setBackupTrigger(true);
  }


  function handleFocus(index: number) {
    const updatedReminders = reminders.map((item, i) => {
      if (i === index) {
        return { ...item, isFocused: true };
      } else {
        return item;
      }
    });
    
    setReminders(updatedReminders);
  }

  const handleItemUpdate = (index: number, value: string | null, name: string) => {
    if (!value?.length) {
      handleTaskDelete(index);
      return;
    }

    const updatedReminders = reminders.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value, isFocused: false };
      } else {
        return item;
      }
    });
    
    setReminders(updatedReminders);
    setBackupTrigger(true);
  };

  const updateRemainingTime = () => {
    const timeLeft = getTimeLeft(new Date(reminders[0]?.createdAt), preference.sprintTiming);
    if (reminders[0]) {
      setTimeLeft(timeLeft);
    }
  };

  useEffect(() => {
    updateRemainingTime();
    const intervalId = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(intervalId);
  }, [reminders[0]?.createdAt]);

  return (
    <div className="tracker">
      <div className="container">
        <form className="input" onSubmit={handleSubmit}>
          {(reminders[0] && !timeLeft.includes('NaN')) &&
            <div className="timing-tracker">
              <h4 className="time">Remaining time: <span>{timeLeft}</span></h4>
              <div className="actions">
                <div className="completed icon" onClick={() => handleTaskDelete(0)}>
                  <Complete/>
                </div>
                <div className="repeat icon" onClick={() => handleDueTimeUpdate(reminders)}>
                  <Repeat/>
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
        {reminders.length ? reminders?.map((task, index) => (
          <div key={index} className={`reminder ${task.isFocused && 'focused'}`}>
            <h4 className={`title t-${index}`} 
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => handleItemUpdate(index, event.target.textContent, 'title')}
              onFocus={() => handleFocus(index)}
              onKeyDown={handleKeyDown}>
              {task.title}
            </h4>
            <div className="delete" onClick={() => handleTaskDelete(index)}>
              <Delete /> 
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