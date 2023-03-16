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

chrome.windows.onFocusChanged.addListener((windowId) => {
  // console.log(`Focused window ---- ${windowId} received focus`);
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

onMessage();