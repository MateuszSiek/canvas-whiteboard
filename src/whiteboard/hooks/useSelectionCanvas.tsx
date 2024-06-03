import { useEffect, useRef, useState } from "react";
import { MainCanvas } from "../canvas/MainCanvas";
import { SelectionCanvas, SelectionEventType } from "../canvas/SelectionCanvas";
import {
  AnchorIds,
  dragScaleObject,
  getSelectionAnchors,
  scaleObject,
  updateAnchorMap,
} from "../utils/anchors";
import { ObjectData } from "../types/objects";
import { MouseDiffPosition } from "../types/mouse";

interface SelectionCanvasHook {
  renderObjectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  uiObjectsRef: React.MutableRefObject<Map<number, ObjectData>>;
  canvasSize: { width: number; height: number };
  mainCanvas: React.RefObject<MainCanvas | undefined>;
  uiCanvas: React.RefObject<MainCanvas | undefined>;
}

export function useSelectionCanvas({
  renderObjectsRef,
  uiObjectsRef,
  canvasSize,
  mainCanvas,
  uiCanvas,
}: SelectionCanvasHook): [React.RefObject<HTMLCanvasElement>] {
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvas = useRef<SelectionCanvas>();

  const [selectedObjects, setSelectedObjects] = useState<ObjectData[]>([]);
  const [selectionBox, setSelectionBox] = useState<ObjectData | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<ObjectData | null>(null);

  const [dragableUiObjects, setDragableUiObjects] = useState<ObjectData[]>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mouseDragPos, setMouseDragPos] = useState<MouseDiffPosition | null>(null);

  const handleObjectsSelect = (ids?: number[]) => {
    const selectedObjects: ObjectData[] = ids
      ?.map((id) => renderObjectsRef.current?.get(id))
      .filter((object) => object !== undefined) as ObjectData[];

    setSelectedObjects(selectedObjects);

    const anchors = getSelectionAnchors(selectedObjects);
    updateAnchorMap(uiObjectsRef.current!, anchors);
    setDragableUiObjects(anchors || []);
    setSelectionBox(anchors?.find((anchor) => anchor.id === AnchorIds.box) || null);

    selectionCanvas.current?.render();
    uiCanvas.current?.render();
  };

  const handleAnchorSelect = (id?: number) => {
    const selectedObject = id ? uiObjectsRef.current?.get(id) : null;
    setSelectedAnchor(selectedObject || null);
  };

  const handleMouseDrag = (dragData: MouseDiffPosition) => {
    setMouseDragPos(dragData);
  };

  const handleMouseDragEnd = () => {
    setIsDragging(false);
    selectionCanvas.current?.render();
  };

  const handleMouseDragStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!!selectionCanvasRef.current) {
      selectionCanvas.current = new SelectionCanvas({
        objects: renderObjectsRef.current,
        uiObjects: uiObjectsRef.current,
        element: selectionCanvasRef.current,
        ...canvasSize,
      });

      selectionCanvas.current.addEventListener(
        SelectionEventType.objectsSelect,
        handleObjectsSelect,
      );
      selectionCanvas.current.addEventListener(SelectionEventType.anchorSelect, handleAnchorSelect);
      selectionCanvas.current.addEventListener(SelectionEventType.mouseDrag, handleMouseDrag);
      selectionCanvas.current.addEventListener(SelectionEventType.mouseDragEnd, handleMouseDragEnd);
      selectionCanvas.current.addEventListener(
        SelectionEventType.mouseDragStart,
        handleMouseDragStart,
      );

      selectionCanvas.current.render();
    }
    return () => {
      if (selectionCanvas.current) {
        selectionCanvas.current.destroy();
      }
    };
  }, [selectionCanvasRef]);

  useEffect(() => {
    if (isDragging && mouseDragPos) {
      const { dx, dy } = mouseDragPos;
      if (selectedAnchor && selectionBox) {
        const scaledSelectionBox = dragScaleObject(mouseDragPos, selectedAnchor, selectionBox);
        const updatedAnchors = getSelectionAnchors([scaledSelectionBox]);

        updateAnchorMap(uiObjectsRef.current!, updatedAnchors);

        selectedObjects.forEach((object) => {
          const newObject = scaleObject(scaledSelectionBox, selectionBox, object);
          renderObjectsRef.current.set(object.id, newObject);
        });
      } else {
        selectedObjects.forEach((object) => {
          const newObject = { ...object, top: object.top + dy, left: object.left + dx };
          renderObjectsRef.current.set(object.id, newObject);
        });
        dragableUiObjects.forEach((object) => {
          const newObject = { ...object, top: object.top + dy, left: object.left + dx };
          uiObjectsRef.current.set(object.id, newObject);
        });
      }
      mainCanvas.current?.render();
      uiCanvas.current?.render();
    }
  }, [isDragging, mouseDragPos, selectedObjects, selectedAnchor]);

  return [selectionCanvasRef];
}
