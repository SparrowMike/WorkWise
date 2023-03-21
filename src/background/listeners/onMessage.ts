import { Preference, RemindersInterface } from "../../interfaces/user";
import { globalPreference, globalReminders } from "../background";
import { updatePreference, updateReminders } from "../background";



//!=============================================TBC
//! needs a script to update the position of the other blobs

/**
 * Updates the position of the content blob.
 * 
 * @param {Object} position - The position of the content blob.
 * @param {string} position.left - The left position of the blob.
 * @param {string} position.right - The right position of the blob.
 */
function updateBlobDataPosition(position: { left: string, right: string }) {
  chrome.storage.sync.set({ preference: JSON.stringify(globalPreference) }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      chrome.tabs.getCurrent((currentTab) => {
        // chrome.tabs.query({ active: true, highlighted: true }, (tabs) => {
        chrome.tabs.query({}, (tabs) => {
          tabs
            // .filter((tab) => tab.id !== currentTab?.id)
            .forEach((tab: any) => {
              try {
                chrome.tabs.sendMessage(tab.id, {
                  type: 'SAVE_BLOB_POSITION',
                  blobPosition: position,
                });
              } catch (e) {
                console.log("Unable to update the content blob data:", e);
              }
            });
        });
      });
    }
  });
}


//!=============================================TBC
//! some unexpected errors - doesn't seem to break anything on the surface
/**
 * Updates the user preference and reminders for all the tabs
 * 
 * @param {boolean} [isActive] - Whether the content blob is active.
 */
function updateBlobData(isActive?: boolean) {
  // ? get current tab and loop over all of the tabs that are currently highlighted(visible on screen) and update the preference and reminders
  chrome.tabs.getCurrent((currentTab: any) => {
    // chrome.tabs.query({ active: true, highlighted: true }, (tabs) => {
    chrome.tabs.query({}, (tabs) => {
      tabs
        .forEach((tab: any) => {
          try {
            // .filter((tab) => tab.id !== currentTab?.id)
            chrome.tabs.sendMessage(tab.id, {
              type: "BLOB_ACTIVATED",
              preference: globalPreference,
              reminders: globalReminders,
              isActive: isActive,
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.log("Unable to update the content blob data:", chrome.runtime.lastError);
              } else if (response && response.success === false) {
                console.log("Unable to update the content blob data:", response.error);
              } else {
                console.log("Content blob data updated successfully:", response);
              }
            });
          } catch (e) {
            console.log("Unable to update the content blob data:", e);
          }
        });
    });
  })
}

/**
  * Registers a message listener with chrome.runtime.onMessage.
  * 
  */
export function onMessage() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(`onMessage, request type --- ${request.type}, sender --- ${sender.origin || sender.url}`)

    switch (request.type) {

      case 'SAVE_REMINDERS':
        console.log(request.reminders)
        chrome.storage.sync.set({ reminders: JSON.stringify(request.reminders) }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: 'Failed to save reminders' });
          } else {
            updateReminders(request.reminders);
            updateBlobData();
            sendResponse({ success: true });
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

      case 'UPDATE_PREFERENCE':
        chrome.storage.sync.set({ preference: JSON.stringify(request.preference) }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: 'Failed to update preference' });
          } else {
            updatePreference({ ...globalPreference, ...request.preference });
            updateBlobData();
            sendResponse({ success: true });
          }
        });
        break;

      case 'LOAD_PREFERENCE':
        chrome.storage.sync.get('preference', (data) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ preference: null, error: 'Failed to load preference' });
          } else {
            sendResponse({ preference: JSON.parse(data?.preference) });
          }
        });
        break;

      case 'SAVE_BLOB_POSITION':
        chrome.storage.sync.set({ preference: JSON.stringify(globalPreference) }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            sendResponse({ success: false, error: 'Failed to save blob position' });
          } else {
            updatePreference({ ...globalPreference, blobPosition: request.blobPosition });
            updateBlobDataPosition(request.blobPosition);
            sendResponse({ success: true });
          }
        });
        break;

      case 'BLOB_ACTIVATED':
        console.log('blob activated', request, globalReminders)
        if (request.reminders) {
          updateReminders(request.reminders);
        }
        if (request.preference) {
          updatePreference(request.preference)
        }
        updateBlobData(request.isActive);
        sendResponse({ success: true });
        break;

      // case 'CLEAR_ALL_DATA': //! =========== TBC ============
      //   chrome.storage.sync.clear(() => {
      //     console.log('Sync data cleared');
      //   });
      //   break;

      // case 'UDPATE_REMINDER_TIMELEFT':
      //   chrome.storage.sync.get('reminders', (data) => {
      //     if (chrome.runtime.lastError) {
      //       console.error(chrome.runtime.lastError);
      //       sendResponse({ reminders: null, error: `Failed to update time for reminder :: ${request.id}` });
      //     } else {
      //       const reminders = JSON.parse(data.reminders || '[]');
      //       if (reminders && reminders.length > 0) {
      //         const udpatedReminderIndex = reminders.findIndex((reminder: { id: string; }) => reminder.id === request.id);
      //         if (udpatedReminderIndex > -1) {
      //           reminders[udpatedReminderIndex].timeLeft = request.timeLeft;
      //           chrome.storage.sync.set({ reminders: JSON.stringify(reminders) }, () => {
      //             sendResponse({ success: true });
      //           });
      //         }
      //       }
      //     }
      //   })
      //   break;
    }
    return true;
  });
}