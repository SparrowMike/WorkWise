import { Preference, RemindersInterface } from "../../interfaces/user";
import { globalPreference, globalReminders } from "../background";
import { updatePreference, updateReminders } from "../background";

function updateBlobDataPosition(position: { left: string, right: string }) {
  chrome.storage.sync.set({ preference: JSON.stringify(globalPreference) }, () => {
    chrome.tabs.getCurrent((currentTab) => {
      chrome.tabs.query({ active: true, highlighted: true }, (tabs) => {
        tabs
          .filter((tab) => tab.id !== currentTab?.id)
          .forEach((tab: any) => {
            try {
              chrome.tabs.sendMessage(tab.id, {
                type: 'SAVE_BLOB_POSITION',
                blobPosition: position,
              });
            } catch (e) {
              console.log("Unable to update the content blob data");
            }
          });
      });
    });
  });
}

//! =============== data does not update across the tabs if the blob is not active
// ! ==== probably due to the interactiveBlob click send msg 
function updateBlobData(preference: Preference, reminders?: RemindersInterface[], isActive?: boolean) {
  // ? get current tab and loop over all of the tabs that are currently highlighted(visible on screen) and update the preference and reminders
  chrome.tabs.getCurrent((currentTab) => {
    // chrome.tabs.query({}, (tabs) => {
    chrome.tabs.query({ active: true, highlighted: true }, (tabs) => {
      tabs
        .filter((tab) => tab.id !== currentTab?.id)
        .forEach((tab: any) => {
          try {
            chrome.tabs.sendMessage(tab.id, {
              type: "BLOB_ACTIVATED",
              preference: preference,
              reminders: reminders,
              isActive: isActive,
            });
          } catch (e) {
            console.log("Unable to update the content blob data");
          }
        });
    });
  });

}

export function onMessage(preference: Preference, reminders: RemindersInterface[]) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`onMessage, request type --- ${request.type}, sender --- ${sender.origin || sender.url}`)

    switch (request.type) {

      case 'SAVE_REMINDERS':
        chrome.storage.sync.set({ reminders: JSON.stringify(request.reminders) }, () => {
          sendResponse({ success: true });
        });
        updateReminders(request.reminders)
        updateBlobData(globalPreference, globalReminders);
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

      case 'UPDATE_PREFERENCE':
        chrome.storage.sync.set({ preference: JSON.stringify(request.preference) });
        updatePreference({ ...globalPreference, ...request.preference })
        updateBlobData(globalPreference);
        break;

      case 'LOAD_PREFERENCE':
        chrome.storage.sync.get('preference', (data) => {
          sendResponse({ preference: JSON.parse(data?.preference) });
        });
        break;

      case 'SAVE_BLOB_POSITION':
        console.log("SAVE_BLOB_POITION-------", request)
        updatePreference({ ...globalPreference, blobPosition: request.blobPosition });
        updateBlobDataPosition(request.blobPosition);
        break;

      case 'BLOB_ACTIVATED':
        updateReminders(request.reminders);
        updatePreference(request.preference)
        // console.log("BLOB_ACTIVATED-------", request)
        updateBlobData(request.preference, request.reminders, request.isActive)
        break;

      case 'CLEAR_ALL_DATA': //! =========== TBC ============
        chrome.storage.sync.clear(() => {
          console.log('Sync data cleared');
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
    }
    return true;
  });
}