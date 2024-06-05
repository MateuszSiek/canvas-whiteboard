import { MouseDiffPosition, MousePosition } from "../types/mouse";

// get mouse position within canvas
export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): MousePosition {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

// get mouse position with delta based on `initialMousePos`
export function getDiffMousePos(
  canvas: HTMLCanvasElement,
  evt: MouseEvent,
  initialMousePos: MousePosition,
  dpr: number,
): MouseDiffPosition {
  const { x, y } = getMousePos(canvas, evt);
  const dx = (x - initialMousePos.x) / dpr;
  const dy = (y - initialMousePos.y) / dpr;
  return {
    x,
    y,
    dx,
    dy,
  };
}
