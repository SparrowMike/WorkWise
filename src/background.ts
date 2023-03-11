let currentTabId: any;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  currentTabId = activeInfo.tabId;
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('background loaded')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //! it will likely grow - lets rewrite this with switch/case 

  // console.log('background triggered', request.type, sender)
  if (request.type === 'notification') {

    // const notificationOptions = {
    //   type: 'basic',
    //   iconUrl: 'https://cdn-icons-png.flaticon.com/512/3449/3449750.png',
    //   title: request.title || 'misisng title',
    //   message: request.message || 'missing message',
    // };
    // chrome.notifications.create(notificationOptions);
  }
  
  if (request.type === 'SAVE_REMINDERS') {
    chrome.storage.sync.set({ reminders: JSON.stringify(request.reminders) }, () => {
      sendResponse({ success: true });
    });
  }

  if (request.type === 'SAVE_REMINDER') {
    chrome.storage.sync.get('reminders', (data) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false, error: 'Failed to load reminders' });
      } else {
        const reminders = JSON.parse(data.reminders || '[]');
        const newReminder = { title: request.title };
        reminders.push(newReminder);
        chrome.storage.sync.set({ reminders: JSON.stringify(reminders) }, () => {
          sendResponse({ success: true });
        });
      }
    });
  }

  if (request.type === 'LOAD_REMINDERS') {
    chrome.storage.sync.get('reminders', (data) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ reminders: null, error: 'Failed to load reminders' });
      } else {
        sendResponse({ reminders: JSON.parse(data?.reminders) });
      }
    });
  }

  if (request.type === 'UPDATE_THEME') {
    chrome.storage.sync.set({ theme: JSON.stringify(request.theme) });
  }
  if (request.type === 'LOAD_THEME') {
    chrome.storage.sync.get('theme', (data) => {
      sendResponse({ theme: JSON.parse(data?.theme) });
    });
  }

  if (request.type === 'SAVE_BLOB_POSITION') {
    chrome.storage.sync.set({ newPosition: JSON.stringify(request.newPosition) });
  }

  if (request.type === 'LOAD_BLOB_POSITION') {
    chrome.storage.sync.get('newPosition', (data) => {
      sendResponse({ newPosition: JSON.parse(data?.newPosition) });
      console.log('new position is ??? ', JSON.parse(data?.newPosition))
    });
  }

  return true;
});