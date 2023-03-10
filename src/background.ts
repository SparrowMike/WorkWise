chrome.runtime.onInstalled.addListener(() => {
  console.log(' background')
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
    chrome.storage.local.set({ reminders: JSON.stringify(request.reminders) }, () => {
      sendResponse({ success: true });
    });
  }

  if (request.type === 'SAVE_REMINDER') {
    chrome.storage.local.get('reminders', (data) => {
      console.log('data save reminder single!', data, request)
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ success: false, error: 'Failed to load reminders' });
      } else {
        const reminders = JSON.parse(data.reminders || '[]');
        const newReminder = { title: request.title };
        reminders.push(newReminder);
        chrome.storage.local.set({ reminders: JSON.stringify(reminders) }, () => {
          sendResponse({ success: true });
        });
      }
    });
  }

  if (request.type === 'LOAD_REMINDER') {
    chrome.storage.local.get('reminders', (data) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({ reminders: null, error: 'Failed to load reminders' });
      } else {
        console.log(data);
        sendResponse({ reminders: JSON.parse(data.reminders) });
      }
    });
  }

  return true;
});