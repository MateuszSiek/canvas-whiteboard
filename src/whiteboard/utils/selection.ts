import { MouseDiffPosition } from "../types/mouse";
import { ObjectData, ObjectType } from "../types/objects";
import { ANCHOR_SIZE } from "./consts";

// Anchor object ids that are mostly usefull for selection
// to easilly distinguish which object was selected
// we use large numbers to reduce changes of collision with other objects
export enum SelectionObjectIds {
  topLeft = 10000,
  topRight = 10001,
  bottomRight = 10002,
  bottomLeft = 10003,
  box = 10004,
}

export function updateSelectionObjectsMap(
  data: Map<number, ObjectData>,
  objects?: ObjectData[],
): void {
  if (objects) {
    objects.forEach((object) => data.set(object.id, object));
  } else {
    Object.values(SelectionObjectIds).forEach((id) => {
      if (typeof id === "number") {
        data.delete(id);
      }
    });
  }
}

// Find edges of the selection box that encapsulates all selected objects
function findSelectionEdges(objects: ObjectData[]): {
  minTop: number;
  minLeft: number;
  maxBottom: number;
  maxRight: number;
} {
  let minTop = Number.MAX_VALUE;
  let minLeft = Number.MAX_VALUE;
  let maxBottom = Number.MIN_VALUE;
  let maxRight = Number.MIN_VALUE;

  objects.forEach((obj) => {
    minTop = Math.min(minTop, obj.top);
    minLeft = Math.min(minLeft, obj.left);
    maxBottom = Math.max(maxBottom, obj.top + obj.height);
    maxRight = Math.max(maxRight, obj.left + obj.width);
  });

  return { minTop, minLeft, maxBottom, maxRight };
}

// Get list of selection objects that encapsulate all selected objects
// and allow us to render selection box and anchors around the objects
export function getSelectionObjects(objects: ObjectData[]): ObjectData[] | undefined {
  if (!objects || objects.length === 0) return undefined;

  const { minTop, minLeft, maxBottom, maxRight } = findSelectionEdges(objects);

  const createAnchor = (id: number, anchorTop: number, anchorLeft: number): ObjectData => ({
    id,
    type: ObjectType.resizeAnchor,
    top: anchorTop - ANCHOR_SIZE / 2,
    left: anchorLeft - ANCHOR_SIZE / 2,
    width: ANCHOR_SIZE,
    height: ANCHOR_SIZE,
  });

  const top = minTop;
  const left = minLeft;
  const width = maxRight - minLeft;
  const height = maxBottom - minTop;
  return [
    {
      id: SelectionObjectIds.box,
      type: ObjectType.resizeAnchorBox,
      top,
      left,
      width,
      height,
    },
    createAnchor(SelectionObjectIds.topLeft, top, left),
    createAnchor(SelectionObjectIds.topRight, top, left + width),
    createAnchor(SelectionObjectIds.bottomRight, top + height, left + width),
    createAnchor(SelectionObjectIds.bottomLeft, top + height, left),
  ];
}

// Given sourseObject which is an initial state of selection box,
// and targetObject which is a new state of selection box,
// scale objectToScale to fit the new selection box
export function scaleObject(
  targetObject: ObjectData,
  sourceObject: ObjectData,
  objectToScale: ObjectData,
): ObjectData {
  const scaleX = targetObject.width / sourceObject.width;
  const scaleY = targetObject.height / sourceObject.height;

  const newLeft = targetObject.left + (objectToScale.left - sourceObject.left) * scaleX;
  const newTop = targetObject.top + (objectToScale.top - sourceObject.top) * scaleY;
  const newWidth = objectToScale.width * scaleX;
  const newHeight = objectToScale.height * scaleY;

  return {
    ...objectToScale,
    left: newLeft,
    top: newTop,
    width: newWidth,
    height: newHeight,
  };
}

// scale `object` based on the `anchor` that is being dragged and `mouseDrag` position change
export function mouseScaleObject(
  mouseDrag: MouseDiffPosition,
  anchor: ObjectData,
  object: ObjectData,
): ObjectData {
  const { dx, dy } = mouseDrag;

  const calculateScaledBox = (
    left: number,
    top: number,
    width: number,
    height: number,
  ): ObjectData => ({
    ...object,
    left,
    top,
    width,
    height,
  });

  switch (anchor.id) {
    case SelectionObjectIds.topLeft:
      return calculateScaledBox(
        object.left + dx,
        object.top + dy,
        object.width - dx,
        object.height - dy,
      );
    case SelectionObjectIds.topRight:
      return calculateScaledBox(
        object.left,
        object.top + dy,
        object.width + dx,
        object.height - dy,
      );
    case SelectionObjectIds.bottomRight:
      return calculateScaledBox(object.left, object.top, object.width + dx, object.height + dy);
    case SelectionObjectIds.bottomLeft:
      return calculateScaledBox(
        object.left + dx,
        object.top,
        object.width - dx,
        object.height + dy,
      );
    default:
      return object;
  }
}
