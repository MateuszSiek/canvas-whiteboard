import { MainCanvas } from "../canvas/MainCanvas";
import { ObjectData } from "../types/objects";
import { useCanvas } from "./useCanvas";

interface UiCanvasHook {
  uiObjectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  canvasSize: { width: number; height: number };
}

export function useUiCanvas(props: UiCanvasHook) {
  const { uiObjectsRef, canvasSize } = props;
  return useCanvas({ objectsRef: uiObjectsRef, canvasSize, CanvasClass: MainCanvas });
}
