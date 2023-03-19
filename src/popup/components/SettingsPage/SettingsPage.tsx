import { useContext } from "react";
import { PreferenceContext } from "../../../context/PreferenceContext";
import { Link } from "react-router-dom";

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
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <SettingsToggle
          title="Theme"
          checked={preference.theme === 'dark'}
          onToggle={handleThemeToggle}
          index={1}
        />

        <SettingsToggle
          title="Show Reminder"
          checked={preference.showReminder || false}
          onToggle={handleShowReminderToggle}
          index={2}
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
      <div className="navigation-container">
        <Link className="link" to="/popup.html">Go to main</Link>
      </div>
    </div>
  )
}

export default SettingsPage;