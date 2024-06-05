import "./Whiteboard.css";
import { useEffect, useRef } from "react";
import { useMainCanvas } from "./hooks/useMainCanvas";
import { useUiCanvas } from "./hooks/useUiCanvas";
import { useSelectionCanvas } from "./hooks/useSelectionCanvas";
import { ObjectData } from "./types/objects";
import { createRandomRectangle, initializeCanvasObjects } from "./utils/objects";

export default function Whiteboard() {
  const renderObjectsRef = useRef<Map<number, ObjectData>>(initializeCanvasObjects());
  const uiObjectsRef = useRef<Map<number, ObjectData>>(new Map());
  const queryParams = new URLSearchParams(window.location.search);
  // in debug view we show 3 canvases side by side to showcase
  // various layers that compose the whiteboard
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
    const object = createRandomRectangle(canvasSize);
    renderObjectsRef.current.set(id, {
      ...object,
      id,
    });
    mainCanvas.current?.render();
    selectCanvas.current?.render();
  };

  const toggleDebugView = () => {
    window.location.search = debugView ? "" : "debug=true";
  };

  useEffect(() => {
    console.log(renderObjectsRef);
  }, []);
  return (
    <>
      <div className={`canvases-wrapper ${debugView && "debug-view"}`}>
        {/* MAIN CANVAS- responsible for rendering shapes the way user sees them */}
        <canvas className="main-canvas" ref={mainCanvasRef} />

        {/* UI CANVAS- responsible for UI elements visible to user eg selection boxes */}
        <canvas className="ui-canvas" ref={uiCanvasRef} />

        {/* SELECTION CANVAS- responsible for user interactions, all events are captured on this layer */}
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
