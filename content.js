
style = `
  width: 50px;
  height: 50px;
  background-color: #8f3aad;
  position: fixed;
  top: 133px;
  left: 152px;
  border-radius: 50%;
  z-index: 2147483647;
`

const elemHtml = `<div id="my-extension" style="${style}"></div>`
document.body.insertAdjacentHTML('beforeend', elemHtml);

const container = document.getElementById('my-extension');
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

container.addEventListener('mousedown', event => {
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

    const interval = setInterval(function () {
      if (width >= 150 && height >= 150) {
        clearInterval(interval);
      } else {
        width += 10;
        height += 10;
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
      }
    }, 50);

  }
});

document.addEventListener('mouseup', event => {
  isDragging = false;

  const interval = setInterval(function () {
    if (width <= 50 && height <= 50) {
      clearInterval(interval);
    } else {
      width -= 10;
      height -= 10;
      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
    }
  }, 50);
});