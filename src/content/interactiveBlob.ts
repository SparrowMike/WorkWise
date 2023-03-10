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

  const extensionUrl = chrome.runtime.getURL('popup.html');
  const currentUrl = window.location.href;

  if (!currentUrl.startsWith("chrome-extension://glmmlghfolpmfcmgccdpnfknhcbhnabn")) {
    document.body.insertAdjacentHTML('beforeend', elemHtml);

    const container = document.getElementById('work-wise__content-container') as HTMLElement;
    const inputWrapper = document.getElementById('work-wise__input-wrapper') as HTMLElement;
    const input = document.getElementById('work-wise__my-input') as HTMLInputElement;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;


    if (container && inputWrapper && input) {
      const userSelectStyle = window.getComputedStyle(container).userSelect;
      console.log(userSelectStyle);

      container.addEventListener('mousedown', (event) => {
        event.stopPropagation();
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
      });

      document.addEventListener('mousemove', event => {
        if (isDragging) {
          document.body.style.userSelect = "none";
          const dx = event.clientX - dragStartX;
          const dy = event.clientY - dragStartY;
          container.style.left = `${container.offsetLeft + dx}px`;
          container.style.top = `${container.offsetTop + dy}px`;
          dragStartX = event.clientX;
          dragStartY = event.clientY;
        }
      });

      document.addEventListener('mouseup', event => {
        isDragging = false;
        document.body.style.userSelect = userSelectStyle;
      });

      container.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!isDragging) {
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

      input.addEventListener('keyup', (event) => {
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