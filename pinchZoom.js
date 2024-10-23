export default function pinchZoom({ screen, target, setState, getState }) {
  target.style.transformOrigin = "top left";

  const handlePinch = ({ zoom, x: centerX, y: centerY }) => {
    if (zoom === 0) return;

    const { x, y, scale } = getState();

    const zoomWeight = 0.02;
    const nextScale = scale + (zoom > 0 ? zoomWeight : -zoomWeight);

    const biasX = ((centerX - x) * nextScale) / scale - (centerX - x);
    const biasY = ((centerY - y) * nextScale) / scale - (centerY - y);
    const nextX = x - biasX;
    const nextY = y - biasY;

    const nextState = {
      x: nextX,
      y: nextY,
      scale: nextScale,
    };

    setState(nextState);
  };

  screen.addEventListener("click", (event) => console.log(event));

  screen.addEventListener("touchstart", (event) =>
    touchStartHandler({ event })
  );
  screen.addEventListener("touchmove", (event) =>
    touchMoveHandler({ event, onPinch: handlePinch })
  );
  screen.addEventListener("touchend", (event) => touchEndHandler({ event }));
  screen.addEventListener("touchcancel", (event) => touchEndHandler({ event }));
}

let prevDiff = -1;
const eventHistory = [];

function touchStartHandler({ event }) {
  console.log(event);
  const touches = event.changedTouches;
  if (eventHistory.length + touches.length <= 2) {
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      eventHistory.push(touch);
    }
  }
}

function touchEndHandler({ event }) {
  const touches = event.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    const index = eventHistory.findIndex(
      (cachedEv) => cachedEv.identifier === touch.identifier
    );
    if (index > -1) {
      eventHistory.splice(index, 1);
    }
  }
}

// 터치 이동시 핀치 발생 체크
function touchMoveHandler({ event, onPinch }) {
  const touches = event.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    const index = eventHistory.findIndex(
      (cachedEv) => cachedEv.identifier === touch.identifier
    );
    if (index !== -1) {
      eventHistory[index] = touch;

      // 두 개의 터치가 진행중인 경우 핀치 줌으로 판단한다
      if (eventHistory.length === 2) {
        const xDiff = eventHistory[0].clientX - eventHistory[1].clientX;
        const yDiff = eventHistory[0].clientY - eventHistory[1].clientY;
        const curDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

        // 첫 핀치의 경우 비교군이 없으므로 prevDiff가 -1인 경우 생략한다.
        if (prevDiff > 0) {
          const zoom = curDiff - prevDiff;
          const x = (eventHistory[0].clientX + eventHistory[1].clientX) / 2;
          const y = (eventHistory[0].clientY + eventHistory[1].clientY) / 2;
          const { top, left } = event.currentTarget.getBoundingClientRect();
          onPinch({ zoom, x: x - left, y: y - top });
        }

        prevDiff = curDiff;
      }
    }
  }
}
