import { PreferenceInterface, ReminderInterface } from "../interfaces/user";
import { onTabFocusChanged } from "./listeners/onTabFocusChanged";
import { onMessage } from "./listeners/onMessage";
import { onListeners } from "./listeners/onListeners";
import { QuoteType } from "../interfaces/api";

/**
 * Daily quote.
 */
export let dailyQuote: QuoteType = { text: "", author: "" };

if (!dailyQuote.text) {
  fetch("https://type.fit/api/quotes")
  .then(res => res.json())
  .then(data => {
    const randomIndex: number = Math.floor(Math.random() * data.length);
    dailyQuote = data[randomIndex];
  })
  .catch(err => {
    console.log("Error fetching Quote")
  })
}
  
/**
 * An array of reminder objects representing the user's reminders.
 */
export let globalReminders: ReminderInterface[];

/**
 * An object representing the user's preferences.
 * The default values are used until the user's preference data is loaded from storage.
 */
export let globalPreference: PreferenceInterface = {
  theme: "dark",
  showReminder: true,
  stickyBlob: false,
  hideBlob: false,
  showTime: true,
  showDate: true,
  sprintTiming: 5,
  blobPosition: {
    left: '20px',
    top: '20px'
  },
};

// chrome.storage.sync.clear(() => {
//   console.log('Sync data cleared');
// });

/**
 * Updates the global preference object with new values.
 * 
 * @param {PreferenceInterface} newPreference - The new preference values to update.
 */
export function updatePreference(newPreference: PreferenceInterface) {
  globalPreference = newPreference;
}

/**
 * Updates the global reminder array with new values.
 * 
 * @param {ReminderInterface[]} newReminders - The new reminder values to update.
 */
export function updateReminders(newReminders: ReminderInterface[]) {
  globalReminders = newReminders;
}

/**
 * A promise that resolves with the user's preference data when it is loaded from storage.
 */
export const preferenceReady = new Promise((resolve) => {
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('preference', (data) => {
      if (data && data.preference) {
        globalPreference = JSON.parse(data.preference);
        resolve(globalPreference);
      } else {
        chrome.storage.sync.set({ preference: JSON.stringify(globalPreference) }, () => {
          resolve(globalPreference);
        });
      }
    });
  }
});

/**
 * A promise that resolves with the user's reminder data when it is loaded from storage.
 */
export const remindersReady = new Promise((resolve) => {
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get('reminders', (data) => {
      try {
        globalReminders = JSON.parse(data?.reminders || []);
        resolve(globalReminders);
      } catch(e) {
        globalReminders = [];
        resolve(globalReminders);
      }
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
        
        startApp();
      });
    });
  }
}

function startApp(): void {
  if (chrome.tabs) {
    /**
     * Handles tab focus changes.
     */
    onTabFocusChanged();

    /**
     * ! ===========TBC==========
     */
    onListeners();

    /**
     * Registers a message listener with chrome.runtime.onMessage.
     */
    onMessage();
  }
}

initializeAppWithPreference();