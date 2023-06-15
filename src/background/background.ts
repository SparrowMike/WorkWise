import { PreferenceInterface, ReminderInterface } from "../interfaces/user";
import { onMessage } from "./listeners/onMessage";
import { QuoteType } from "../interfaces/api";

import { onTabFocusChanged } from "./listeners/onTabFocusChanged";
import { onListeners } from "./listeners/onListeners";

/**
 * Daily quote.
 */
export let dailyQuote: QuoteType = { text: "", author: "" };

export async function fetchDailyQuote(): Promise<QuoteType> {
  try {
    const response = await fetch("https://type.fit/api/quotes");
    const data = await response.json();
    const randomIndex: number = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (err) {
    console.log("Error fetching Quote");
    return {
      text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
      author: "Benjamin Franklin",
    };
  }
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
  sprintTiming: '5',
  blobPosition: {
    left: '20px',
    top: '20px'
  },
};

//! ========================= CLEAR THE DATA
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
export async function initializeAppWithPreference(): Promise<void> {
  if (dailyQuote && !dailyQuote.text) {
    dailyQuote = await fetchDailyQuote();
  }
  if (chrome && chrome.storage && chrome.storage.sync) {
    await new Promise<void>((resolve) => {
      chrome.storage.sync.get(['preference', 'reminders'], async (data) => {
        globalPreference = Object.assign({}, globalPreference, JSON.parse(data?.preference || "{}"));
        globalReminders = JSON.parse(data?.reminders || "[]");
        resolve();
      });
    });
  }
  startApp(); // Moved inside the if statement
}

function startApp() {
  if (chrome.tabs) {
    /**
     * Registers a message listener with chrome.runtime.onMessage.
    */
    onMessage();


    //  ! ======= unsed =========
    /**
     * Handles tab focus changes.
     */
    // onTabFocusChanged();

    /**
     * ! ===========TBC==========
     */
    // onListeners();
  }
}

initializeAppWithPreference();