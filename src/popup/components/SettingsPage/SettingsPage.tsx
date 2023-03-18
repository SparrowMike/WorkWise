import { useContext } from "react";
import { PreferenceContext } from "../../../context/PreferenceContext";
import { Link } from "react-router-dom";

const SettingsToggle: React.FC<{ title: string; checked: boolean; onToggle: () => void }> = ({
  title,
  checked,
  onToggle,
}) => {
  return (
    <div className="settings-toggle">
      <span>{title}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { preference, setPreference } = useContext(PreferenceContext);

  console.log(preference)
  
  const handleThemeToggle = () => {
    const newPreference = { ...preference, theme: preference.theme === 'dark' ? 'light' : 'dark' };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleShowReminderToggle = () => {
    const newPreference = { ...preference, showReminder: !preference.showReminder };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleStickyBlobToggle = () => {
    const newPreference = { ...preference, stickyBlob: !preference.stickyBlob };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleHideBlobToggle = () => {
    const newPreference = { ...preference, hideBlob: !preference.hideBlob };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleShowTimeToggle = () => {
    const newPreference = { ...preference, showTime: !preference.showTime };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleShowDateToggle = () => {
    const newPreference = { ...preference, showDate: !preference.showDate };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  const handleSprintTimingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPreference = { ...preference, sprintTiming: parseInt(event.target.value) };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: 'UPDATE_PREFERENCE', preference: newPreference });
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <SettingsToggle
          title="Theme"
          checked={preference.theme === 'dark'}
          onToggle={handleThemeToggle}
        />
        <SettingsToggle
          title="Show Reminder"
          checked={preference.showReminder}
          onToggle={handleShowReminderToggle}
        />
        <SettingsToggle
          title="Sticky Blob"
          checked={preference.stickyBlob}
          onToggle={handleStickyBlobToggle}
        />
        <SettingsToggle
          title="Hide Blob"
          checked={preference.hideBlob}
          onToggle={handleHideBlobToggle}
        />
        <SettingsToggle
          title="Show Time"
          checked={preference.showTime}
          onToggle={handleShowTimeToggle}
        />

        <SettingsToggle
          title="Show Date"
          checked={preference.showDate}
          onToggle={handleShowDateToggle}
        />
        <label htmlFor="spring-timing-input">Sprint Time:</label>
        <input
          title="Sprint Time"
          type="number"
          min="1"
          max="10"
          value={preference.sprintTiming && preference.sprintTiming.toString()}
          onChange={handleSprintTimingChange}
        />
      </div>
      <Link to="/popup.html">Got to settings</Link>
    </div>
  )
}

export default SettingsPage;