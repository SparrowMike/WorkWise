let style = `
  width: 50px;
  height: 50px;
  background-color: #8f3aad;
  position: fixed;
  top: 133px;
  left: 152px;
  border-radius: 50%;
  z-index: 2147483647;
  cursor: pointer;
`

const elemHtml = `
  <div id="my-extension" style="${style}">
    <div id="input-wrapper" style="display: none">
      <input id="my-input" type="text" style="width: 100%">
    </div>
  </div>
`

const extensionUrl = chrome.runtime.getURL('popup.html');
const currentUrl = window.location.href;
if (!currentUrl.startsWith("chrome-extension://glmmlghfolpmfcmgccdpnfknhcbhnabn")) {
  document.body.insertAdjacentHTML('beforeend', elemHtml);
  console.log('!content')

  const container = document.getElementById('my-extension');
  const inputWrapper = document.getElementById('input-wrapper');
  const input: any = document.getElementById('my-input');

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  if (container && inputWrapper && input) {
    container.addEventListener('mousedown', event => {
      event.stopPropagation();
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    });

    let width = 50;
    let height = 50;

    document.addEventListener('mousemove', event => {
      if (isDragging) {
        const dx = event.clientX - dragStartX;
        const dy = event.clientY - dragStartY;
        container.style.left = `${container.offsetLeft + dx}px`;
        container.style.top = `${container.offsetTop + dy}px`;
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        // const interval = setInterval(function () {
        //   if (width >= 150 && height >= 150) {
        //     clearInterval(interval);
        //   } else {
        //     width += 10;
        //     height += 10;
        //     container.style.width = `${width}px`;
        //     container.style.height = `${height}px`;
        //   }
        // }, 50);
      }
    });

    container.addEventListener('click', (event: any) => {
      input.focus();
      inputWrapper.style.display = "block";
    })

    document.addEventListener('mouseup', event => {
      isDragging = false;

      // if (width > 50 || height > 50) {
      //   const interval = setInterval(function () {
      //     if (width <= 50 && height <= 50) {
      //       clearInterval(interval);
      //       inputWrapper.style.display = "none";
      //       input.value = "";
      //       width = 50;
      //       height = 50;
      //       container.style.width = `${width}px`;
      //       container.style.height = `${height}px`;
      //     } else {
      //       width -= 10;
      //       height -= 10;
      //       container.style.width = `${width}px`;
      //       container.style.height = `${height}px`;
      //     }
      //   }, 50);
      // } else {
      //   inputWrapper.style.display = "block";
      // input.focus();
      // }
    });

    input.addEventListener('keyup', (event: any) => {
      if (event.key === 'Enter') {
        const inputValue = input.value.trim();
        if (inputValue !== "") {
          chrome.runtime.sendMessage({ type: "SAVE_REMINDER",  title: inputValue });
          inputWrapper.style.display = "none";
          input.value = "";
          width = 50;
          height = 50;
          container.style.width = `${width}px`;
          container.style.height = `${height}px`;
        }
      }
    });
  }
}