import { Preference, RemindersInterface } from "../interfaces/user";
import { onTabFocusChanged } from "./listeners/onTabFocusChanged";
import { onMessage } from "./listeners/onMessage";

export let globalReminders: RemindersInterface[];
export function updateReminders(newReminders: RemindersInterface[]) {
  globalReminders = newReminders;
}
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
export function updatePreference(newPreference: Preference) {
  globalPreference = newPreference;
}

let currentTabId: any;

export const preferenceReady = new Promise((resolve) => {
  chrome.storage.sync.get('preference', (data) => {
    globalPreference = Object.assign({}, globalPreference, JSON.parse(data?.preference || "{}"));
    resolve(globalPreference);
  });
});

export const remindersReady = new Promise((resolve) => {
  chrome.storage.sync.get('reminders', (data) => {
    globalReminders = JSON.parse(data?.reminders || []);
    resolve(globalReminders);
  });
});

export function initializeAppWithPreference(): void {
  chrome.storage.sync.get('preference', (preferenceData) => {
    globalPreference = Object.assign({}, globalPreference, JSON.parse(preferenceData?.preference || "{}"));

    chrome.storage.sync.get('reminders', (remindersData) => {
      globalReminders = JSON.parse(remindersData?.reminders || "[]");

      startApp(globalPreference, globalReminders);
    });
  });
}

function startApp(preference: Preference, reminders: RemindersInterface[]): void {
  console.log('-----startApp - preference-------', preference)
  console.log('-----startApp - reminders -------', reminders)

  if (chrome.tabs) {

    chrome.tabs.onActivated.addListener(function (activeInfo) {
      currentTabId = activeInfo.tabId;
      showWindowsAndTabs();
      // console.log(`Activated tab ----- ${activeInfo.tabId}`);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      // console.log(`Updated tab ------- ${tabId}`, 'changeInfo-----', changeInfo);
      showWindowsAndTabs();
    });

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      // console.log(`Removed tab ------- ${tabId}`, 'remove info----', removeInfo);
      showWindowsAndTabs();
    });


    function showWindowsAndTabs() {
      chrome.tabs.query({}, (tabs) => {
        const filter = tabs.map(item => {
          const { width, height, incognito, mutedInfo, ...items } = item;
          return items;
        })
        // console.log('Current tabs ------')
        // console.table(filter);
        // console.table(tabs);
      });

      chrome.windows.getAll({ populate: true }, (windows) => {
        // console.log('Windows all -------');
        // console.table(windows);
      });
    }

    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        // console.log('Extension installed!');
      } else if (details.reason === 'update') {
        // console.log(`Extension updated to version ${chrome.runtime.getManifest().version}!`);
      } else if (details.reason === 'chrome_update') {
        // console.log('Chrome browser updated!');
      }
    });

    chrome.runtime.onConnect.addListener(() => {
      // console.log('connection made')
      chrome.runtime.reload();
    })

    onTabFocusChanged();
    onMessage(preference, reminders);
  }
}

initializeAppWithPreference();