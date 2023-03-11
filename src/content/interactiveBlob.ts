import { blobGreen } from "./blobs";
import { blobFirst } from "./blobs";

export function interactiveBlob() {
  let blob = blobGreen()

  const elemHtml = `
  <div id="work-wise__content-container">
    <div id="work-wise__input-wrapper" style="display: none">
      <input id="work-wise__my-input" type="text">
    </div>
    ${blob}
  </div>  
`

  const currentUrl = window.location.href;

  if (!currentUrl.includes("glmmlghfolpmfcmgccdpnfknhcbhnabn" || "ilodfinadncakkokondgknkehonhcckc" || "dlkjllhiohiehadgjfbcjpcgnnppimba")) {
    document.body.insertAdjacentHTML('beforeend', elemHtml);

    const container = document.getElementById('work-wise__content-container') as HTMLElement;
    const inputWrapper = document.getElementById('work-wise__input-wrapper') as HTMLElement;
    const input = document.getElementById('work-wise__my-input') as HTMLInputElement;

    chrome.runtime.sendMessage({ type: 'LOAD_BLOB_POSITION' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        if (response && response.newPosition) {
          container.style.left = `${response.newPosition.x}px`;
          container.style.top = `${response.newPosition.y}px`;
        }
      }
    });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    if (container && inputWrapper && input) {
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
        }, 10);
        chrome.runtime.sendMessage({  type: 'SAVE_BLOB_POSITION', newPosition: { x: event.clientX, y: event.clientY} });
      });

      container.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!container.classList.contains('dragging') && !isDragging) {
          input.focus();
          container.classList.add('input-active');
          inputWrapper.style.display = "block";
        }
      })

      document.addEventListener('click', event => {
        inputWrapper.style.display = "none";
        input.value = "";
        container.classList.remove('input-active');
      });

      input.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
          const inputValue = input.value.trim();
          if (inputValue !== "") {
            chrome.runtime.sendMessage({ type: "SAVE_REMINDER", title: inputValue });
            inputWrapper.style.display = "none";
            changeBlobColor();
            input.value = "";
            container.classList.remove('input-active');
          }
        }
      });
    }
  }
}

// !================= temp var for toggle =======================
let toggle = true;

export function changeBlobColor() {
  const path = document.getElementById('work-wise__blobSvg');
  if (path) {
    path.setAttribute('fill', 'url(#gradient)');
    const gradient = path.querySelector('#gradient');
    if (gradient) {
      if (toggle) {
        //@ts-ignore
        gradient.querySelector('stop[offset="0%"]').style.stopColor = '#E90064';
        //@ts-ignore
        gradient.querySelector('stop[offset="100%"]').style.stopColor = '#B3005E';
      } else {
        //@ts-ignore
        gradient.querySelector('stop[offset="0%"]').style.stopColor = '#7DCE13';
        //@ts-ignore
        gradient.querySelector('stop[offset="100%"]').style.stopColor = '#5BB318';
      }
      toggle = !toggle
    }
  }
}