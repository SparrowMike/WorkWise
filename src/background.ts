let currentTabId: any;

chrome.tabs.onActivated.addListener(function (activeInfo) {
  currentTabId = activeInfo.tabId;
  console.log(activeInfo)
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(`Tab ${activeInfo.tabId} was activated`);
  showWindowsAndTabs();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab ${tabId} was updated`);
  showWindowsAndTabs();
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`Tab ${tabId} was removed`);
  showWindowsAndTabs();
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log(`Window ${windowId} received focus`);
  showWindowsAndTabs();
});

function showWindowsAndTabs() {
  chrome.tabs.query({}, (tabs) => {
    console.log('current tabs----', tabs);
  });
  
  chrome.windows.getAll({ populate: true }, (windows) => {
    console.log('current windows----', windows);
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed!');
  } else if (details.reason === 'update') {
    console.log(`Extension updated to version ${chrome.runtime.getManifest().version}!`);
  } else if (details.reason === 'chrome_update') {
    console.log('Chrome browser updated!');
  }
});


chrome.runtime.onConnect.addListener(() => {
  console.log('connection made')
  chrome.runtime.reload();
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //! it will likely grow - lets rewrite this with switch/case 
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
        const newReminder = { id: request.id, title: request.title, timeLeft: request.timeLeft };
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

  if (request.type === 'UDPATE_REMINDER_TIMELEFT') {
    chrome.storage.sync.get('reminders', (data) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ reminders: null, error: `Failed to update time for reminder :: ${request.id}` });
      } else {
        const reminders = JSON.parse(data.reminders || '[]');
        if (reminders && reminders.length > 0) {
          const udpatedReminderIndex = reminders.findIndex((reminder: { id: string; }) => reminder.id === request.id);
          if (udpatedReminderIndex > -1) {
            reminders[udpatedReminderIndex].timeLeft = request.timeLeft;
            chrome.storage.sync.set({ reminders: JSON.stringify(reminders) }, () => {
              sendResponse({ success: true });
            });
          }
        }
      }
    })
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
    });
  }

  return true;
});