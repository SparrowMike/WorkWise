import { useContext } from "react";
import { PreferenceContext } from "../../../context/PreferenceContext";
import { Link } from "react-router-dom";
import Clock from "../Shared/Clock";

const SettingsToggle: React.FC<{ title: string; checked: boolean; onToggle: () => void; index: number; }> = ({
  title,
  checked,
  onToggle,
  index
}) => {
  const inputId = `toggle-${index}`;
  return (
    <div className="settings-toggle">
      <span>{title}</span>
      <div className="switch">
        <input id={inputId} type="checkbox" checked={checked} onChange={onToggle} />
        <label htmlFor={inputId} className="slider round"></label>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { preference, setPreference } = useContext(PreferenceContext);

  const messageType = 'UPDATE_PREFERENCE';

  const handleThemeToggle = () => {
    const newPreference = { ...preference, theme: preference.theme === 'dark' ? 'light' : 'dark' };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleShowReminderToggle = () => {
    const newPreference = { ...preference, showReminder: !preference.showReminder };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleStickyBlobToggle = () => {
    const newPreference = { ...preference, stickyBlob: !preference.stickyBlob };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleHideBlobToggle = () => {
    const newPreference = { ...preference, hideBlob: !preference.hideBlob };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleShowTimeToggle = () => {
    const newPreference = { ...preference, showTime: !preference.showTime };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleShowDateToggle = () => {
    const newPreference = { ...preference, showDate: !preference.showDate };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  const handleSprintTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreference = { ...preference, sprintTiming: parseInt(event.target.value) };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  return (
    <div className="popup settings-page">
      <div className="popup__header container">
        <div className="settings-icon">
          <Link className="link" to="/">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5002 25.6666H17.5002C23.3335 25.6666 25.6668 23.3333 25.6668 17.4999V10.4999C25.6668 4.66659 23.3335 2.33325 17.5002 2.33325H10.5002C4.66683 2.33325 2.3335 4.66659 2.3335 10.4999V17.4999C2.3335 23.3333 4.66683 25.6666 10.5002 25.6666Z" stroke="var(--primary-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.5001 17.9433H16.2401C18.2235 17.9433 19.8335 16.3333 19.8335 14.3499C19.8335 12.3666 18.2235 10.7566 16.2401 10.7566H8.3418" stroke="var(--primary-1)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.99817 12.5649L8.1665 10.7216L9.99817 8.88989" stroke="var(--primary-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

          </Link>
        </div>
        <Clock />
      </div>
      <div className="settings-container container">
        <div className="type">Global:</div>
        <div className="settings">
          <SettingsToggle
            title="Dark Theme"
            checked={preference.theme === 'dark'}
            onToggle={handleThemeToggle}
            index={1}
          />
          <div className="settings-toggle">
            <span>Sprint Time</span>
            <input
              title="Sprint Time"
              type="number"
              className="number-field"
              min="1"
              max="10"
              value={preference.sprintTiming && preference.sprintTiming.toString()}
              onChange={handleSprintTimingChange}
            />
          </div>
        </div>
      </div>

      <div className="settings-container container" style={{'margin': '0px'}}>
        <div className="type">Blob Settings:</div>
        <div className="settings">
          <SettingsToggle
            title="Show Reminder"
            checked={preference.showReminder || false}
            onToggle={handleShowReminderToggle}
            index={2}
          />
          <SettingsToggle
            title="Show Time"
            checked={preference.showTime || false}
            onToggle={handleShowTimeToggle}
            index={5}
          />
          <SettingsToggle
            title="Show Date"
            checked={preference.showDate || false}
            onToggle={handleShowDateToggle}
            index={6}
          />
          <SettingsToggle
            title="Sticky Blob"
            checked={preference.stickyBlob || false}
            onToggle={handleStickyBlobToggle}
            index={3}
          />
          <SettingsToggle
            title="Hide Blob"
            checked={preference.hideBlob || false}
            onToggle={handleHideBlobToggle}
            index={4}
          />
        </div>
      </div>
      <div className="settings-container">
      </div>
    </div>
  )
}

export default SettingsPage;