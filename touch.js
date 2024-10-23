import pinchZoom from "./pinchZoom";

export function touchInit(screen, target) {
  const state = {
    x: 0,
    y: 0,
    scale: 1,
  };

  const setState = ({ x, y, scale }) => {
    state.x = x;
    state.y = y;
    state.scale = scale;
    target.style.transform = `translateX(${x}px) translateY(${y}px) scale(${scale})`;
  };

  const getState = () => state;

  pinchZoom({ screen, target, setState, getState });
}
