import { useRef } from "react";
import { useMainCanvas } from "./hooks/useMainCanvas";
import { useUiCanvas } from "./hooks/useUiCanvas";
import { useSelectionCanvas } from "./hooks/useSelectionCanvas";
import { ObjectData } from "./types/objects";
import { initializeCanvasObjects } from "./utils/objects";

function WhiteboardCanvas() {
  const renderObjectsRef = useRef<Map<number, ObjectData>>(initializeCanvasObjects());
  const uiObjectsRef = useRef<Map<number, ObjectData>>(new Map());

  const canvasSize = { width: 500, height: 500 };

  const [mainCanvasRef, mainCanvas] = useMainCanvas({ renderObjectsRef, canvasSize });
  const [uiCanvasRef, uiCanvas] = useUiCanvas({ uiObjectsRef, canvasSize });
  const [selectionCanvasRef] = useSelectionCanvas({
    renderObjectsRef,
    uiObjectsRef,
    canvasSize,
    mainCanvas,
    uiCanvas,
  });

  return (
    <>
      <canvas ref={mainCanvasRef} />
      <canvas style={{ position: "absolute", top: 0, left: 0 }} ref={uiCanvasRef} />
      <canvas ref={selectionCanvasRef} />
    </>
  );
}

export default function Whiteboard() {
  return (
    <div>
      <WhiteboardCanvas />
    </div>
  );
}
