import { MouseDiffPosition, MousePosition } from "../types/mouse";

export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): MousePosition {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

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
