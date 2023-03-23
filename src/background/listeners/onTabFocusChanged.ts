import { PreferenceInterface, ReminderInterface } from "../../interfaces/user";
import { globalPreference, globalReminders } from "../background";

export function onTabFocusChanged() {
  // chrome.tabs.onActivated.addListener((activeInfo) => {
  //   const currentTabId = activeInfo.tabId;
  //   chrome.tabs.get(currentTabId, (currentTab) => {
  //     console.log(`Focused tab ${currentTabId} received focus`);
  //     try {
  //       chrome.tabs.sendMessage(currentTabId, {
  //         type: "BLOB_ACTIVATED",
  //         preference: globalPreference,
  //         reminders: globalReminders,
  //       });
  //     } catch (e) {
  //       console.error(`Failed to send message to tab ${currentTabId}: ${e}`);
  //     }
  //   });
  // });
}
