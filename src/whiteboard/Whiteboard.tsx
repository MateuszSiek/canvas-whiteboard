import "./Whiteboard.css";
import { useRef } from "react";
import { useMainCanvas } from "./hooks/useMainCanvas";
import { useUiCanvas } from "./hooks/useUiCanvas";
import { useSelectionCanvas } from "./hooks/useSelectionCanvas";
import { ObjectData, ObjectType } from "./types/objects";
import { initializeCanvasObjects } from "./utils/objects";

export default function Whiteboard() {
  const renderObjectsRef = useRef<Map<number, ObjectData>>(initializeCanvasObjects());
  const uiObjectsRef = useRef<Map<number, ObjectData>>(new Map());
  const queryParams = new URLSearchParams(window.location.search);
  const debugView = Boolean(queryParams.get("debug"));

  const canvasSize = {
    width: debugView ? window.innerWidth / 3 : window.innerWidth,
    height: window.innerHeight,
  };

  const [mainCanvasRef, mainCanvas] = useMainCanvas({ renderObjectsRef, canvasSize });
  const [uiCanvasRef, uiCanvas] = useUiCanvas({ uiObjectsRef, canvasSize });
  const [selectionCanvasRef, selectCanvas] = useSelectionCanvas({
    renderObjectsRef,
    uiObjectsRef,
    canvasSize,
    mainCanvas,
    uiCanvas,
  });

  const addRectangle = () => {
    const existingIds = Array.from(renderObjectsRef.current.keys());
    const id = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const width = 100 + Math.random() * 100;
    const height = 100 + Math.random() * 100;
    const left = canvasSize.width / 2 - width / 2 + Math.random() * 200 - 200;
    const top = canvasSize.height / 2 - height / 2 + Math.random() * 200 - 200;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    renderObjectsRef.current.set(id, {
      id,
      type: ObjectType.rectangle,
      left,
      top,
      width,
      height,
      color,
    });
    mainCanvas.current?.render();
    selectCanvas.current?.render();
  };

  const toggleDebugView = () => {
    window.location.search = debugView ? "" : "debug=true";
  };

  return (
    <>
      <div className={`canvases-wrapper ${debugView && "debug-view"}`}>
        <canvas className="main-canvas" ref={mainCanvasRef} />
        <canvas className="ui-canvas" ref={uiCanvasRef} />
        <canvas className="selection-canvas" ref={selectionCanvasRef} />
      </div>
      <div className="controll-ui">
        <div className="controll-ui-inner-wrapper">
          <button onClick={addRectangle}>+ rectangle</button>
          <button onClick={toggleDebugView}>{debugView ? "Canvas view" : "Debug view"}</button>
        </div>
      </div>
    </>
  );
}
