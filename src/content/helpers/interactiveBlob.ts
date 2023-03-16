import { samplePref } from "./samplePref";

export function createBlob() {
  const elemHtml = '<div id="work-wise__content"></div>';

  if (!['WorkWise - Popup Extension', 'WorkWise - Options Extension'].includes(document.title)) {
    document.body.insertAdjacentHTML('beforeend', elemHtml);
  }
}

export function interactiveBlob (container: HTMLElement) {
  let isActive = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  chrome.storage.sync.get('blobPosition', (data) => {
    const blobPosition = JSON.parse(data.blobPosition || '{}');
    
    if (blobPosition.left && blobPosition.top) {
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
  
      // Adjust the maximum and minimum values for the left and top CSS properties
      let newLeft = Math.max(minLeft, Math.min(maxLeft, parseFloat(blobPosition.left)));
      let newTop = Math.max(minTop, Math.min(maxTop, parseFloat(blobPosition.top)));
  
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
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

    document.addEventListener('mousemove', event => {
      if (isDragging) {
        container.classList.add('dragging');
        
        document.body.style.userSelect = "none";

        // Get the size of the container
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Get the size of the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate the maximum and minimum values for the left and top CSS properties
        const maxLeft = viewportWidth - containerWidth / 2;
        const maxTop = viewportHeight - containerHeight / 2;
        const minLeft = -containerWidth / 2;
        const minTop = -containerHeight / 2;

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
      isDragging = false;
      document.body.style.userSelect = userSelectStyle;
      setTimeout(() => {
        container.classList.remove('dragging');
      }, 10); // timeout to prevent click event firing 

      const blobPosition = { left: container.style.left, top: container.style.top };
      chrome.runtime.sendMessage({ type: 'SAVE_BLOB_POSITION', blobPosition });
    });

    container.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!container.classList.contains('dragging') && !isDragging) {
        chrome.storage.sync.get('preference', (data) => {
          const preference = samplePref || JSON.parse(data.preference || '{}'); //! TEMPORARY SAMPLE PREFERENCE
          if (!isActive) {
            isActive = true;
            container.classList.add('input-active');
            chrome.runtime.sendMessage({ type: 'BLOB_ACTIVATED', preference: { ...preference, isActive: true } });
          }
        });
      }
    })

    document.addEventListener('click', event => {
      if (isActive) {
        isActive = false;
        container.classList.remove('input-active');
        chrome.runtime.sendMessage({ type: 'BLOB_ACTIVATED', preference: { isActive: false } });
      }
    });
  }
}