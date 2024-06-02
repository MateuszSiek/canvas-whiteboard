import { useEffect, useRef } from "react";
import { CanvasObject, ObjectData, ObjectType } from "./objects/Object";
import { Rectangle } from "./objects/Rectangle";
import { SelectionCanvas } from "./canvas/SelectionCanvas";
import { MainCanvas } from "./canvas/MainCanvas";

const initializeCanvasObjects = (objects: ObjectData[]): Map<string, CanvasObject> => {
  return objects.reduce((objectsMap, objectData) => {
    let object: CanvasObject | undefined = undefined;
    if (objectData.type === ObjectType.rectangle) {
      object = new Rectangle(objectData);
    }

    if (!object) {
      throw new Error(`Unknown object type ${objectData.type}`);
    }

    objectsMap.set(objectData.id + "", object);
    return objectsMap;
  }, new Map<string, CanvasObject>());
};

function WhiteboardCanvas() {
  const canvasObjects = [
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
      top: 400,
      left: 300,
      width: 200,
      height: 100,
      color: "#ffe353",
    },
  ];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<MainCanvas>();
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvas = useRef<SelectionCanvas>();

  useEffect(() => {
    const objects = initializeCanvasObjects(canvasObjects);
    const canvasSize = { width: 700, height: 700 };
    if (!!canvasRef.current) {
      canvas.current = new MainCanvas({ element: canvasRef.current, ...canvasSize }, objects);
      canvas.current.render();
    }
    if (!!selectionCanvasRef.current) {
      selectionCanvas.current = new SelectionCanvas(
        { element: selectionCanvasRef.current, ...canvasSize },
        objects,
      );
      selectionCanvas.current.addEventListener("objectHover", (id) => {
        console.log("objectHover", id);
      });
      selectionCanvas.current.addEventListener("objectsSelect", (id) => {
        console.log("objectsSelect", id);
      });
      selectionCanvas.current.render();
    }

    return () => {
      canvas.current = undefined;
      if (selectionCanvas.current) {
        selectionCanvas.current.destroy();
      }
    };
  }, [canvasRef]);

  return (
    <>
      <canvas ref={canvasRef} />
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
