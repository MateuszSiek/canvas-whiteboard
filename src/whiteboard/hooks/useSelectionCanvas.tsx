import { useEffect, useRef, useState } from "react";
import { MainCanvas } from "../canvas/MainCanvas";
import { SelectionCanvas, SelectionEventType } from "../canvas/SelectionCanvas";
import {
  SelectionObjectIds,
  mouseScaleObject,
  getSelectionObjects,
  scaleObject,
  updateSelectionObjectsMap,
} from "../utils/selection";
import { ObjectData } from "../types/objects";
import { MouseDiffPosition } from "../types/mouse";
import { updateRefObjects } from "../utils/objects";

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
}: SelectionCanvasHook): [
  React.RefObject<HTMLCanvasElement>,
  React.RefObject<SelectionCanvas | undefined>,
] {
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCanvas = useRef<SelectionCanvas>();

  // list of objects selected by the user when dragging or resizing
  // those are used to calculate the delta position and scale
  const [selectedObjects, setSelectedObjects] = useState<ObjectData[]>([]);

  // list of UI objects that are used to drag and resize the selectedObjects
  const [dragableUiObjects, setDragableUiObjects] = useState<ObjectData[]>([]);

  // we store selected anchor to know which anchor is being dragged and how to resize the objects
  const [selectedAnchor, setSelectedAnchor] = useState<ObjectData>();

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mouseDragPos, setMouseDragPos] = useState<MouseDiffPosition>();

  const handleObjectsSelect = (ids?: number[]) => {
    // map ids to objects
    const selectedObjects: ObjectData[] =
      ids
        ?.map((id) => renderObjectsRef.current?.get(id))
        .filter((object): object is ObjectData => object !== undefined) || [];

    setSelectedObjects(selectedObjects);

    // get selection objects(anchor points and bounding box) for selected objects
    const selectionObjects = getSelectionObjects(selectedObjects);
    updateSelectionObjectsMap(uiObjectsRef.current!, selectionObjects);
    setDragableUiObjects(selectionObjects || []);

    // after selection is updated we need to render the main canvas to show selection
    // and ui canvas to make the selectionObjects selectable
    selectionCanvas.current?.render();
    uiCanvas.current?.render();
  };

  const handleAnchorSelect = (id?: number) => {
    const selectedObject = id ? uiObjectsRef.current?.get(id) : undefined;
    setSelectedAnchor(selectedObject);
  };

  const handleMouseDrag = (dragData: MouseDiffPosition) => {
    setMouseDragPos(dragData);
  };

  const handleMouseDragEnd = () => {
    setIsDragging(false);
    // once dragging is done we need to update the position of the selected objects
    // there is no need to update position while dragging since you can't both drag and select new objects
    selectionCanvas.current?.render();
  };

  const handleMouseDragStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    // initialize selection canvas
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
    // handle dragging and resizing of selected objects

    if (!isDragging || !mouseDragPos) return;

    const { dx, dy } = mouseDragPos;

    const selectionBox = dragableUiObjects?.find((anchor) => anchor.id === SelectionObjectIds.box);

    // if anchor is selected that means we are resizing the objects
    if (selectedAnchor && selectionBox) {
      // first scale the selection box
      const scaledSelectionBox = mouseScaleObject(mouseDragPos, selectedAnchor, selectionBox);
      // generate new selection anchors based on the scaled selection box
      const updatedAnchors = getSelectionObjects([scaledSelectionBox]);

      //  update uiObjects with new anchors and selection box
      updateSelectionObjectsMap(uiObjectsRef.current!, updatedAnchors);

      // scale all selected objects based on the scaled selection box
      updateRefObjects(renderObjectsRef, selectedObjects, (object) =>
        scaleObject(scaledSelectionBox, selectionBox, object),
      );
    } else {
      // if no anchor is selected that means we are dragging the objects
      const translateObject = (object: ObjectData) => ({
        ...object,
        top: object.top + dy,
        left: object.left + dx,
      });
      // we need to update both renderObjects and uiObjects so that we can render live changes to main and ui canvas
      updateRefObjects(renderObjectsRef, selectedObjects, translateObject);
      updateRefObjects(uiObjectsRef, dragableUiObjects, translateObject);
    }
    // render main and ui canvas to show the changes
    // there is no need to render selection canvas
    mainCanvas.current?.render();
    uiCanvas.current?.render();
  }, [isDragging, mouseDragPos, selectedObjects, selectedAnchor]);

  return [selectionCanvasRef, selectionCanvas];
}
