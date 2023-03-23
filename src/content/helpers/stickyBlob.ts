export function checkForStickyBlob(stickyBlob: boolean, blobPosition: { left: string, top: string }, width: number, height: number, container: HTMLElement) {
  if (stickyBlob) {
    // get the position of the stickyBlob element as strings
    const stickyBlobLeftString: string = blobPosition.left;
    const stickyBlobTopString: string = blobPosition.top;

    // convert the string positions to numbers
    const stickyBlobLeft: number = parseInt(stickyBlobLeftString);
    const stickyBlobTop: number = parseInt(stickyBlobTopString);

    // calculate the distances between the stickyBlob element and each side of the window
    const distances: Record<string, number> = {
      left: stickyBlobLeft,
      right: width - (stickyBlobLeft + container.offsetWidth),
      top: stickyBlobTop,
      bottom: height - (stickyBlobTop + container.offsetHeight),
    };

    // find the closest side of the window
    const closestSide: string = Object.keys(distances).reduce(
      (a, b) => (distances[a] < distances[b] ? a : b)
    );

    // set the position of the container to stick to the closest side
    switch (closestSide) {
      case "left":
        container.style.left = "0px";
        container.style.top = stickyBlobTopString;
        break;
      case "right":
        container.style.left = `${width - container.offsetWidth}px`;
        container.style.top = stickyBlobTopString;
        break;
      case "top":
        container.style.top = "0px";
        container.style.left = stickyBlobLeftString;
        break;
      case "bottom":
        container.style.top = `${height - container.offsetHeight}px`;
        container.style.left = stickyBlobLeftString;
        break;
      default:
        break;
    }
  } else {
    container.style.left = blobPosition.left;
    container.style.top = blobPosition.top;
  }
}