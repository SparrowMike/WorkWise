export function isRunningAsChromeExtension() {
  let isChromeExtension = false;

  if (typeof chrome !== 'undefined') {
    if (chrome.runtime && chrome.runtime.id) {
      isChromeExtension = true;
    }
  }

  return isChromeExtension;
}