
import { Preference, RemindersInterface } from "../../interfaces/user";
export function onFocusChanged(preference: Preference, reminders: RemindersInterface[]) {
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
  });
}