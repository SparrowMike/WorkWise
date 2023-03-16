export function onMessage() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`onMessage, request type --- ${request.type}, sender --- ${sender.origin || sender.url}`)

    switch (request.type) {

      case 'SAVE_REMINDERS':
        chrome.storage.sync.set({ reminders: JSON.stringify(request.reminders) }, () => {
          sendResponse({ success: true });
        });
        break;

      case 'SAVE_REMINDER':
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
        break;

      case 'LOAD_REMINDERS':
        chrome.storage.sync.get('reminders', (data) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ reminders: null, error: 'Failed to load reminders' });
          } else {
            sendResponse({ reminders: JSON.parse(data?.reminders) });
          }
        });
        break;

      case 'UDPATE_REMINDER_TIMELEFT':
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
        break;

      case 'UPDATE_THEME':
        chrome.storage.sync.set({ theme: JSON.stringify(request.theme) });
        break;

      case 'LOAD_THEME':
        chrome.storage.sync.get('theme', (data) => {
          sendResponse({ theme: JSON.parse(data?.theme) });
        });
        break;

      case 'SAVE_BLOB_POSITION':
        chrome.storage.sync.set({ blobPosition: JSON.stringify(request.blobPosition) });
        break;

      case 'LOAD_BLOB_POSITION':
        chrome.storage.sync.get('blobPosition', (data) => {
          sendResponse({ blobPosition: JSON.parse(data?.blobPosition) });
        });
        break;

      case 'SAVE_BLOB_POSITION':
        chrome.storage.sync.set({ blobPosition: JSON.stringify(request.blobPosition) }, () => {
          // function sendUpdateToAllTabs(blobPosition: any) {
          //   chrome.tabs.query({}, (tabs) => {
          //     tabs.forEach((tab) => {
          //       console.log('attempt to update')
          //       if (tab.id) {
          //         chrome.tabs.sendMessage(tab.id, {
          //           type: 'UPDATE_BLOB_POSITION',
          //           blobPosition: blobPosition,
          //         });
          //       }
          //     });
          //   });
          // }

          // sendUpdateToAllTabs(request.blobPosition);
        });
        break;

      case 'UPDATE_BLOB_POSITION':
        const blobPosition = request.blobPosition;
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id as number, {
              type: 'UPDATE_BLOB_POSITION',
              blobPosition: blobPosition,
            });
          });
        });
        break;

      case 'BLOB_ACTIVATED':
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab: any | undefined = tabs[0];
          if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, { type: 'BLOB_ACTIVATED', preference: request.preference });
          }
        });
        break;
    }

    return true;
  });
}