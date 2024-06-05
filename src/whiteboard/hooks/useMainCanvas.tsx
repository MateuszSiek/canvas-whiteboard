import { MainCanvas } from "../canvas/MainCanvas";
import { ObjectData } from "../types/objects";
import { useCanvas } from "./useCanvas";

interface MainCanvasHook {
  renderObjectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  canvasSize: { width: number; height: number };
}

// Hook to create a main canvas responsible for rendering objects visible to the user
export function useMainCanvas(props: MainCanvasHook) {
  const { renderObjectsRef, canvasSize } = props;
  return useCanvas({ objectsRef: renderObjectsRef, canvasSize, CanvasClass: MainCanvas });
}
