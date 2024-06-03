import { useEffect, useRef } from "react";
import { ObjectData, ObjectType } from "./objects/Object";
import { SelectionCanvas } from "./canvas/SelectionCanvas";
import { MainCanvas } from "./canvas/MainCanvas";
import { getSelectionAnchors, initializeCanvasObjects, updateAnchorMap } from "./utils";

const canvasObjects: ObjectData[] = [
  {
    id: 1,
    type: ObjectType.rectangle,
    top: 100,
    left: 100,
    width: 100,
    height: 100,
    color: "#3cffba",
  },
  {
    id: 2,
    type: ObjectType.rectangle,
    top: 80,
    left: 400,
    width: 50,
    height: 50,
    color: "#3cffba",
  },
  {
    id: 3,
    type: ObjectType.rectangle,
    top: 400,
    left: 300,
    width: 200,
    height: 100,
    color: "#ffe353",
  },
];

function WhiteboardCanvas() {
  const objectsRef = useRef<Map<number, ObjectData>>();

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvas = useRef<MainCanvas>();
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvas = useRef<SelectionCanvas>();

  useEffect(() => {
    objectsRef.current = initializeCanvasObjects(canvasObjects);
    const canvasSize = { width: 700, height: 700 };
    if (!!mainCanvasRef.current) {
      mainCanvas.current = new MainCanvas({
        objects: objectsRef.current,
        element: mainCanvasRef.current,
        ...canvasSize,
      });
      mainCanvas.current.render();
    }
    if (!!selectionCanvasRef.current) {
      selectionCanvas.current = new SelectionCanvas({
        objects: objectsRef.current,
        element: selectionCanvasRef.current,
        ...canvasSize,
      });

      selectionCanvas.current.addEventListener("objectsSelect", (ids) => {
        console.log("Selected objects", ids);
        const selectedObjects: ObjectData[] = ids
          ?.map((id) => objectsRef.current?.get(id))
          .filter((object) => object !== undefined)
          .filter((object) => object?.type !== ObjectType.resizeAnchor) as ObjectData[];

        const anchors = getSelectionAnchors(selectedObjects);
        updateAnchorMap(objectsRef.current!, anchors);

        selectionCanvas.current?.render();
        mainCanvas.current?.render();
      });
      selectionCanvas.current.render();
    }

    return () => {
      if (selectionCanvas.current) {
        selectionCanvas.current.destroy();
      }
      if (mainCanvas.current) {
        mainCanvas.current.destroy();
      }
    };
  }, [mainCanvasRef]);

  return (
    <>
      <canvas ref={mainCanvasRef} />
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
