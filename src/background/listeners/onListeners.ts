export function onListeners() {

  chrome.tabs.onActivated.addListener(function (activeInfo) {
    // console.log(`Activated tab ----- ${activeInfo.tabId}`);
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log(`Updated tab ------- ${tabId}`, 'changeInfo-----', changeInfo);
  });

  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // console.log(`Removed tab ------- ${tabId}`, 'remove info----', removeInfo);
  });

  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // console.log('Extension installed!');
    } else if (details.reason === 'update') {
      // console.log(`Extension updated to version ${chrome.runtime.getManifest().version}!`);
    } else if (details.reason === 'chrome_update') {
      // console.log('Chrome browser updated!');
    }
  });

  // chrome.runtime.onConnect.addListener(() => {
  //   // console.log('connection made')
  //   chrome.runtime.reload();
  // })

}