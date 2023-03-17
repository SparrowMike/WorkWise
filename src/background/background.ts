import { onMessage } from "./onMessage";

let currentTabId: any;

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

chrome.windows.onFocusChanged.addListener((windowId) => { //! ========================= construction ==============================
  // console.log(`Focused window ---- ${windowId} received focus`);

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is currently in focus
  } else {
    // chrome.storage.sync.get({ reminders: null, preference: null }, data => {
    //   if (chrome.runtime.lastError) {
    //     console.error(chrome.runtime.lastError);
    //   } else {
    //     const reminders = JSON.parse(data.reminders || '[]');
    //     const preference = JSON.parse(data.preference || '{}');
    //     chrome.storage.sync.set({ preference: JSON.stringify(preference) }, () => {
    //       if (chrome.runtime.lastError) {
    //         console.error(chrome.runtime.lastError);
    //       } else {
    //         const firstReminder = reminders[0] || null;
    //         chrome.runtime.sendMessage({
    //           type: 'BLOB_ACTIVATED',
    //           preference: {
    //             ...preference,
    //             reminder: firstReminder.title,
    //             showReminder: true
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
  }
  showWindowsAndTabs();
});

function showWindowsAndTabs() {
  chrome.tabs.query({}, (tabs) => {
    const filter = tabs.map(item => {
      const {width, height, incognito, mutedInfo, ...items} = item;
      return items;
    })
    // console.log('Current tabs ------')
    // console.table(filter);
    // console.table(tabs);
  });
  
  // chrome.windows.getAll({ populate: true }, (windows) => {
  //   // console.log('Windows all -------');
  //   console.table(windows);
  // });
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

onMessage();