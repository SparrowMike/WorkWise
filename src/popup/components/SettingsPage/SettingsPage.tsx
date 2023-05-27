import { useContext } from "react";
import { PreferenceContext } from "../../../context/PreferenceContext";
import { Link } from "react-router-dom";
import Clock from "../Shared/Clock";

import Back from './../../../assets/svg/back.svg'
import Info from './../../../assets/svg/info.svg'
  
const SettingsToggle: React.FC<{ title: string; checked: boolean; tooltipContent?: string; tooltipPosition?: string; onToggle: () => void; index: number; }> = ({
  title,
  checked,
  tooltipContent,
  tooltipPosition,
  onToggle,
  index
}) => {
  const inputId = `toggle-${index}`;
  return (
    <div className="settings-toggle">
      <span>{title}</span>
      {tooltipContent && (
        <div className="info">
          <Info className="info-logo" />
          <div className="info-container" data-position={tooltipPosition}>
            {tooltipContent}
          </div>
        </div>
      )}
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
    const newPreference = { ...preference, sprintTiming: event.target.value };
    setPreference(newPreference);
    chrome.runtime.sendMessage({ type: messageType, preference: newPreference });
  };

  return (
    <div className="popup settings-page">
      <div className="popup__header container">
        <div className="settings-icon">
          <Link className="link" to="/">
            <Back />
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
              value={preference.sprintTiming ? preference.sprintTiming.toString() : '5'} 
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
            tooltipContent="Shows current reminder when blob is active."
            checked={preference.showReminder || false}
            onToggle={handleShowReminderToggle}
            index={2}
          />
          <SettingsToggle
            title="Show Time"
            tooltipContent="Shows time when blob is active"
            checked={preference.showTime || false}
            onToggle={handleShowTimeToggle}
            index={5}
          />
          <SettingsToggle
            title="Show Date"
            tooltipContent="Shows date when blob is active"
            checked={preference.showDate || false}
            onToggle={handleShowDateToggle}
            index={6}
          />
          <SettingsToggle
            title="Sticky Blob"
            tooltipContent="When active, blob will stick to the closest edge of the screen"
            checked={preference.stickyBlob || false}
            onToggle={handleStickyBlobToggle}
            index={3}
          />
          <SettingsToggle
            title="Hide Blob"
            tooltipContent="Will not be visible, unless current reminder is due"
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