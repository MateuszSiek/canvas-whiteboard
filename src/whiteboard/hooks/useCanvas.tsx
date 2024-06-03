import { useEffect, useRef } from "react";
import { MainCanvas } from "../canvas/MainCanvas";
import { ObjectData } from "../renderers/Object";

export function useCanvas({
  objectsRef,
  canvasSize,
  CanvasClass,
}: {
  objectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  canvasSize: { width: number; height: number };
  CanvasClass: typeof MainCanvas;
}): [React.RefObject<HTMLCanvasElement>, React.RefObject<MainCanvas | undefined>] {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<MainCanvas | undefined>();

  useEffect(() => {
    if (canvasRef.current) {
      canvasInstanceRef.current = new CanvasClass({
        objects: objectsRef.current,
        element: canvasRef.current,
        ...canvasSize,
      });
      canvasInstanceRef.current.render();
    }

    return () => {
      canvasInstanceRef.current?.destroy();
    };
  }, [canvasRef]);

  return [canvasRef, canvasInstanceRef];
}
