import { useEffect, useRef } from "react";
import { Canvas } from "./canvas/Canvas";
import { CanvasObject, ObjectData, ObjectType } from "./objects/Object";
import { Rectangle } from "./objects/Rectangle";

const initializeCanvasObjects = (
  objects: ObjectData[],
): Map<string, CanvasObject> => {
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
    },
    {
      id: 2,
      type: ObjectType.rectangle,
      top: 400,
      left: 400,
      width: 100,
      height: 100,
    },
  ];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas>();

  useEffect(() => {
    if (!!canvasRef.current) {
      const objects = initializeCanvasObjects(canvasObjects);
      canvas.current = new Canvas(
        { element: canvasRef.current, width: 700, height: 700 },
        objects,
      );
      canvas.current.render();
    }
  }, [canvasRef]);

  return <canvas ref={canvasRef} />;
}

export default function Whiteboard() {
  return (
    <div>
      <WhiteboardCanvas />
    </div>
  );
}
