import { useState, useEffect } from "react";
import { ReminderInterface } from "../../../interfaces/user";

function Tracker() {
  const ReminderInterface: ReminderInterface = {
    id: '',
    title: '',
    description: '',
    priority: 0,
    reminder: false,
    isFocused: false,
  };

  const [taskArray, setTaskArray] = useState<ReminderInterface[]>([]);
  const [task, setTask] = useState<ReminderInterface>(ReminderInterface);
  const [backupTrigger, setBackupTrigger] = useState(false);

  const handleOptionsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  useEffect(() => {
    if (!taskArray.length) {
      chrome.runtime.sendMessage({ type: 'LOAD_REMINDERS' }, (response) => {
        console.log('tracker response -------------- ', response)
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

    setTask({ ...task, [name]: value });
  }

  function handleTaskDelete(index: number) {
    setTaskArray(taskArray.filter((_, i) => index !== i));
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

  return (
    <div className="tracker">
      <form className="input container" onSubmit={handleSubmit}>
        <input id="work-wise__my-input" type="text" name="title" placeholder="What's your next focus?" value={task.title} onChange={(event) => handleChange(event)} />
      </form>
      <div className="reminders container">
        {taskArray.length ? taskArray?.map((task, index) => (
          <div key={index} className={`reminder ${task.isFocused && 'focused'}`}>
            <h4 className="title" 
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
            <h1>
              No reminders
            </h1>
          </div>}
      </div>
      {/* ====   no plans for options in the MVP   ==== */}
      {/* <a onClick={handleOptionsClick} style={{ alignSelf: 'baseline', padding: '10px 5px', textDecoration: 'underline', cursor: 'pointer' }}>Options</a> */}
    </div>
  )
}

export default Tracker