import { Preference, RemindersInterface } from "../interfaces/user";
import { onFocusChanged } from "./listeners/onFocusChanged";
import { onMessage } from "./listeners/onMessage";

export let reminders: RemindersInterface[];
export let preference: Preference = {
  theme: "light",
  showReminder: false,
  stickyBlob: false,
  hideBlob: false,
  showTime: false,
  showDate: false,
  sprintTiming: 5,
  blobPosition: {
    left: '20px',
    top: '23px'
  },
};

let currentTabId: any;

export const preferenceReady = new Promise((resolve) => {
  chrome.storage.sync.get('preference', (data) => {
    preference = Object.assign({}, preference, JSON.parse(data?.preference || "{}"));
    resolve(preference);
  });
});

export const remindersReady = new Promise((resolve) => {
  chrome.storage.sync.get('reminders', (data) => {
    reminders = JSON.parse(data?.reminders || []);
    resolve(reminders);
  });
});

export function initializeAppWithPreference(): void {
  chrome.storage.sync.get('preference', (preferenceData) => {
    preference = Object.assign({}, preference, JSON.parse(preferenceData?.preference || "{}"));

    chrome.storage.sync.get('reminders', (remindersData) => {
      reminders = JSON.parse(remindersData?.reminders || "[]");

      startApp(preference, reminders);
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

    onFocusChanged(preference, reminders);
  }

  onMessage(preference, reminders);
}

initializeAppWithPreference();