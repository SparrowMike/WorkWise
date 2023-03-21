import { Preference, RemindersInterface } from "../interfaces/user";
import { onTabFocusChanged } from "./listeners/onTabFocusChanged";
import { onMessage } from "./listeners/onMessage";
import { onListeners } from "./listeners/onListeners";

/**
 * An array of reminder objects representing the user's reminders.
 */
export let globalReminders: RemindersInterface[];

/**
 * An object representing the user's preferences.
 * The default values are used until the user's preference data is loaded from storage.
 */
export let globalPreference: Preference = {
  theme: "light",
  showReminder: false,
  stickyBlob: false,
  hideBlob: false,
  showTime: false,
  showDate: false,
  sprintTiming: 5,
  blobPosition: {
    left: '20px',
    top: '20px'
  },
};

/**
 * Updates the global preference object with new values.
 * 
 * @param {Preference} newPreference - The new preference values to update.
 */
export function updatePreference(newPreference: Preference) {
  globalPreference = newPreference;
}

/**
 * Updates the global reminder array with new values.
 * 
 * @param {RemindersInterface[]} newReminders - The new reminder values to update.
 */
export function updateReminders(newReminders: RemindersInterface[]) {
  globalReminders = newReminders;
}

/**
 * A promise that resolves with the user's preference data when it is loaded from storage.
 */
export const preferenceReady = new Promise((resolve) => {
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('preference', (data) => {
      globalPreference = Object.assign({}, globalPreference, JSON.parse(data?.preference || "{}"));
      resolve(globalPreference);
    });
  }
});

/**
 * A promise that resolves with the user's reminder data when it is loaded from storage.
 */
export const remindersReady = new Promise((resolve) => {
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('reminders', (data) => {
      globalReminders = JSON.parse(data?.reminders || []);
      resolve(globalReminders);
    });
  }
});

/**
 * Initializes the app with the user's preference and reminder data loaded from storage.
 * 
 * This function should be called when the extension is initialized.
 */
export function initializeAppWithPreference(): void {
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('preference', (preferenceData) => {
      globalPreference = Object.assign({}, globalPreference, JSON.parse(preferenceData?.preference || "{}"));
      
      chrome.storage.sync.get('reminders', (remindersData) => {
        globalReminders = JSON.parse(remindersData?.reminders || "[]");
        
        startApp(globalPreference, globalReminders);
      });
    });
  }
}

function startApp(preference: Preference, reminders: RemindersInterface[]): void {
  console.log('-----startApp - preference-------', preference)
  console.log('-----startApp - reminders -------', reminders)

  if (chrome.tabs) {
    /**
     * Handles tab focus changes.
     */
    onTabFocusChanged();

    /**
     * ! ===========TBC
     */
    onListeners();

    /**
     * Registers a message listener with chrome.runtime.onMessage.
     */
    onMessage();
  }
}

initializeAppWithPreference();