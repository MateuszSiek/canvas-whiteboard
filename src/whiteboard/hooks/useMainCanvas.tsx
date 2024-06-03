import { MainCanvas } from "../canvas/MainCanvas";
import { ObjectData } from "../types/objects";
import { useCanvas } from "./useCanvas";

interface MainCanvasHook {
  renderObjectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  canvasSize: { width: number; height: number };
}

export function useMainCanvas(props: MainCanvasHook) {
  const { renderObjectsRef, canvasSize } = props;
  return useCanvas({ objectsRef: renderObjectsRef, canvasSize, CanvasClass: MainCanvas });
}
