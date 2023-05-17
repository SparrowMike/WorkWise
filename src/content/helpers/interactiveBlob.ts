import { BLOB_HEIGHT, BLOB_WIDTH } from "../../constants";
import { globalPreference, globalReminders } from "../../background/background";
import { checkForStickyBlob } from "./stickyBlob";

let isSticky = globalPreference.stickyBlob;
let blobPosition = globalPreference?.blobPosition;

export function createBlob() {
  const elemHtml = '<div id="work-wise__content"></div>';

  if (!['WorkWise - Popup Extension', 'WorkWise - Options Extension'].includes(document.title)) {
    document.body.insertAdjacentHTML('beforeend', elemHtml);
  }
}

//? ================================================================================
function updateTheBlob(request: any, sender: any, sendResponse: any) {
  if (request.type === 'BLOB_POSITION_UPDATE') {
    const container = document.getElementById('work-wise__content')
    if (container) {
      checkForStickyBlob(request.stickyBlob, request.blobPosition, request.width, request.height, container);
      isSticky = request.stickyBlob;
    }
    sendResponse({ status: true })
  }
}
chrome.runtime.onMessage.removeListener(updateTheBlob);
chrome.runtime.onMessage.addListener(updateTheBlob);
//? ================================================================================

export function interactiveBlob(container: HTMLElement) {
  isSticky = globalPreference.stickyBlob;
  blobPosition = globalPreference.blobPosition;

  let isActive = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  if (blobPosition && blobPosition.left && blobPosition.top) {
    // Get the size of the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    // Calculate the maximum and minimum values for the left and top CSS properties
    const maxLeft = viewportWidth - BLOB_WIDTH;
    const maxTop = viewportHeight - BLOB_HEIGHT;
    const minLeft = 0;
    const minTop = 0;

    // Adjust the maximum and minimum values for the left and top CSS properties
    const newLeft = Math.max(minLeft, Math.min(maxLeft, parseFloat(blobPosition.left)));
    const newTop = Math.max(minTop, Math.min(maxTop, parseFloat(blobPosition.top)));

    if (isSticky) {
      const stickyBlobPosition = {
        left: `${newLeft}px`,
        top: `${newTop}px`,
      };
      checkForStickyBlob(true, stickyBlobPosition, window.innerWidth, window.innerHeight, container);
    } else {
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    }
  }

  window.addEventListener('resize', () => {
    const left = window.innerWidth - BLOB_WIDTH;
    const top = window.innerHeight - BLOB_HEIGHT;

    if (top <= parseFloat(container.style.top) && top > 0) {
      container.style.top = `${top}px`;
    }
    if (left <= parseFloat(container.style.left)) {
      container.style.left = `${left}px`;
    }
    if (isSticky) {
      const stickyBlobPosition = {
        left: `${Math.max(0, Math.min(left, parseFloat(container.style.left)))}px`,
        top: `${Math.max(0, Math.min(top, parseFloat(container.style.top)))}px`,
      };
      checkForStickyBlob(true, stickyBlobPosition, window.innerWidth, window.innerHeight, container);
    }
  });


  if (container) {
    const userSelectStyle = window.getComputedStyle(container).userSelect;

    container.addEventListener('mousedown', (event) => {
      event.stopPropagation();
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        container.classList.add("dragging");

        document.body.style.userSelect = "none";

        // Get the size of the container
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Get the size of the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate the maximum and minimum values for the left and top CSS properties
        const maxLeft = viewportWidth - containerWidth;
        const maxTop = viewportHeight - containerHeight;
        const minLeft = 0;
        const minTop = 0;

        // Update the left and top CSS properties of the container element
        let newLeft = container.offsetLeft + event.clientX - dragStartX;
        let newTop = container.offsetTop + event.clientY - dragStartY;

        // Adjust the maximum and minimum values for the left and top CSS properties
        if (newLeft > maxLeft) {
          newLeft = maxLeft;
        } else if (newLeft < minLeft) {
          newLeft = minLeft;
        }

        if (newTop > maxTop) {
          newTop = maxTop;
        } else if (newTop < minTop) {
          newTop = minTop;
        }

        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;

        // Update the drag start position
        dragStartX = event.clientX;
        dragStartY = event.clientY;
      }
    });


    document.addEventListener('mouseup', event => {
      if (isDragging) {
        const blobPosition = { left: container.style.left, top: container.style.top };
        chrome.runtime.sendMessage({ type: 'SAVE_BLOB_POSITION', stickyBlob: isSticky, blobPosition });

        // If isSticky is true, make the container stick to the closest edge
        if (isSticky) {
          const blobPosition = {
            left: `${container.offsetLeft}px`,
            top: `${container.offsetTop}px`,
          };
          checkForStickyBlob(true, blobPosition, window.innerWidth, window.innerHeight, container);
        }
        isDragging = false;
        document.body.style.userSelect = userSelectStyle;
        setTimeout(() => {
          container.classList.remove('dragging');
        }, 10); //? timeout to prevent click event firing 
      }
    });

    // ? on click get the preference and the reminder that is to be displayed - send everything to the blob
    container.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!container.classList.contains('dragging') && !isDragging) {
        if (!isActive) {
          isActive = true;
          container.classList.add('input-active');
          try {
            chrome.runtime.sendMessage({
              type: 'BLOB_ACTIVATED',
              isActive: true
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              }
            });
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      }
    });

    document.addEventListener('click', event => {
      if (isActive) {
        isActive = false;
        container.classList.remove('input-active');
        try {
          chrome.runtime.sendMessage({
            type: 'BLOB_ACTIVATED',
            isActive: false
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
          });
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    });
  }
}