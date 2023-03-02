chrome.runtime.onInstalled.addListener(() => {
  console.log(' background')
})

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.type === 'notification') {
    console.log('notification received', data)

    const notificationOptions = {
      type: 'basic',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3449/3449750.png',
      title: data.title || 'misisng title',
      message: data.message || 'missing message',
    };
    
    chrome.notifications.create(notificationOptions);
  }
});