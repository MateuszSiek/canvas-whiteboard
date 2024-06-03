import { useEffect, useRef, useState } from "react";
import { ObjectData, ObjectType } from "./objects/Object";
import { MouseDragData, SelectionCanvas } from "./canvas/SelectionCanvas";
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
  const renderObjectsRef = useRef<Map<number, ObjectData>>(initializeCanvasObjects(canvasObjects));
  const uiObjectsRef = useRef<Map<number, ObjectData>>(new Map());

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvas = useRef<MainCanvas>();

  const uiCanvasRef = useRef<HTMLCanvasElement>(null);
  const uiCanvas = useRef<MainCanvas>();

  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvas = useRef<SelectionCanvas>();

  const canvasSize = { width: 500, height: 500 };

  const [draggableObjects, setDraggableObjects] = useState<ObjectData[]>([]);
  const [dragableUiObjects, setDragableUiObjects] = useState<ObjectData[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mouseDrag, setMouseDrag] = useState<MouseDragData | null>(null);

  useEffect(() => {
    if (isDragging && mouseDrag) {
      const { dx, dy } = mouseDrag;
      draggableObjects.forEach((object) => {
        const newObject = { ...object, top: object.top + dy, left: object.left + dx };
        renderObjectsRef.current.set(object.id, newObject);
      });
      dragableUiObjects.forEach((object) => {
        const newObject = { ...object, top: object.top + dy, left: object.left + dx };
        uiObjectsRef.current.set(object.id, newObject);
      });
      mainCanvas.current?.render();
      uiCanvas.current?.render();
    }
  }, [isDragging, mouseDrag, draggableObjects]);

  useEffect(() => {
    if (!!selectionCanvasRef.current) {
      selectionCanvas.current = new SelectionCanvas({
        objects: renderObjectsRef.current,
        uiObjects: uiObjectsRef.current,
        element: selectionCanvasRef.current,
        ...canvasSize,
      });

      selectionCanvas.current.addEventListener("objectsSelect", (ids) => {
        const selectedObjects: ObjectData[] = ids
          ?.map((id) => renderObjectsRef.current?.get(id))
          .filter((object) => object !== undefined) as ObjectData[];

        setDraggableObjects(selectedObjects);

        const anchors = getSelectionAnchors(selectedObjects);
        updateAnchorMap(uiObjectsRef.current!, anchors);
        setDragableUiObjects(anchors || []);

        selectionCanvas.current?.render();
        uiCanvas.current?.render();
      });

      selectionCanvas.current.addEventListener("mouseDrag", (dragData) => {
        setMouseDrag(dragData);
      });

      selectionCanvas.current.addEventListener("mouseDragEnd", () => {
        setIsDragging(false);
        selectionCanvas.current?.render();
      });

      selectionCanvas.current.addEventListener("mouseDragStart", () => {
        setIsDragging(true);
      });

      selectionCanvas.current.render();
    }
    return () => {
      if (selectionCanvas.current) {
        selectionCanvas.current.destroy();
      }
    };
  }, [selectionCanvasRef]);

  useEffect(() => {
    if (!!mainCanvasRef.current) {
      mainCanvas.current = new MainCanvas({
        objects: renderObjectsRef.current,
        element: mainCanvasRef.current,
        ...canvasSize,
      });
      mainCanvas.current.render();
    }

    return () => {
      if (mainCanvas.current) {
        mainCanvas.current.destroy();
      }
    };
  }, [mainCanvasRef]);

  useEffect(() => {
    if (!!uiCanvasRef.current) {
      uiCanvas.current = new MainCanvas({
        objects: uiObjectsRef.current,
        element: uiCanvasRef.current,
        ...canvasSize,
      });
      uiCanvas.current.render();
    }

    return () => {
      if (mainCanvas.current) {
        mainCanvas.current.destroy();
      }
    };
  }, [mainCanvasRef]);

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
