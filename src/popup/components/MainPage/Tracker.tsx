import { useState, useEffect } from "react";
import { RemindersInterface } from "../../../interfaces/user";

function Tracker() {
  const RemindersInterface: RemindersInterface = {
    title: '',
    description: '',
    priority: 0,
    reminder: false,
  };

  const [taskArray, setTaskArray] = useState<RemindersInterface[]>([]);
  const [task, setTask] = useState<RemindersInterface>(RemindersInterface);
  const [backupTrigger, setBackupTrigger] = useState(false);

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
    setTask(RemindersInterface);
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


  const handleItemUpdate = (index: number, value: string | null, name: string) => {
    if (!value?.length) {
      handleTaskDelete(index);
      return;
    }

    setTaskArray((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
    setBackupTrigger(true);
  };

  return (
    <div className="tracker">
      <form onSubmit={handleSubmit}>
        <input id="work-wise__my-input" type="text" name="title" value={task.title} onChange={(event) => handleChange(event)} />
      </form>
      <div className="reminders">
        {taskArray?.map((task, index) => (
          <div key={index} className="reminder">
            <h4 contentEditable
              suppressContentEditableWarning
              onBlur={(event) => handleItemUpdate(index, event.target.textContent, 'title')}
              style={{ display: "inline-block" }}>
              {task.title}
            </h4>
            <div className="delete" onClick={() => handleTaskDelete(index)}><svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.4 13.5L8 10.9L10.6 13.5L12 12.1L9.4 9.5L12 6.9L10.6 5.5L8 8.1L5.4 5.5L4 6.9L6.6 9.5L4 12.1L5.4 13.5ZM3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999333 16.5493 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.5493 18.0007 13 18H3ZM13 3H3V16H13V3Z" />
            </svg>
            </div>
          </div>
        ))}
      </div>
      {/* ====   no plans for options in the MVP   ==== */}
      {/* <a onClick={handleOptionsClick} style={{ alignSelf: 'baseline', padding: '10px 5px', textDecoration: 'underline', cursor: 'pointer' }}>Options</a> */}
    </div>
  )
}

export default Tracker