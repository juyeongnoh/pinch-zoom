export default function preventZoom() {
  function listener(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  document.addEventListener("touchmove", listener, { passive: false });
}
