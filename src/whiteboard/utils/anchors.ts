import { MouseDiffPosition } from "../types/mouse";
import { ObjectData, ObjectType } from "../types/objects";

export enum AnchorIds {
  topLeft = 10000,
  topRight = 10001,
  bottomRight = 10002,
  bottomLeft = 10003,
  box = 10004,
}

export function getAnchorObjects(
  top: number,
  left: number,
  width: number,
  height: number,
): ObjectData[] {
  const anchorSize = 10;

  const createAnchor = (id: number, anchorTop: number, anchorLeft: number): ObjectData => ({
    id,
    type: ObjectType.resizeAnchor,
    top: anchorTop - anchorSize / 2,
    left: anchorLeft - anchorSize / 2,
    width: anchorSize,
    height: anchorSize,
  });

  return [
    {
      id: AnchorIds.box,
      type: ObjectType.resizeAnchorBox,
      top,
      left,
      width,
      height,
    },
    createAnchor(AnchorIds.topLeft, top, left),
    createAnchor(AnchorIds.topRight, top, left + width),
    createAnchor(AnchorIds.bottomRight, top + height, left + width),
    createAnchor(AnchorIds.bottomLeft, top + height, left),
  ];
}

export function updateAnchorMap(data: Map<number, ObjectData>, anchors?: ObjectData[]): void {
  if (anchors) {
    anchors.forEach((anchor) => data.set(anchor.id, anchor));
  } else {
    Object.values(AnchorIds).forEach((id) => {
      if (typeof id === "number") {
        data.delete(id);
      }
    });
  }
}

export function getSelectionAnchors(objects: ObjectData[]): ObjectData[] | undefined {
  if (!objects || objects.length === 0) return undefined;

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
  return getAnchorObjects(minTop, minLeft, maxRight - minLeft, maxBottom - minTop);
}

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

export function dragScaleObject(
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
    case AnchorIds.topLeft:
      return calculateScaledBox(
        object.left + dx,
        object.top + dy,
        object.width - dx,
        object.height - dy,
      );
    case AnchorIds.topRight:
      return calculateScaledBox(
        object.left,
        object.top + dy,
        object.width + dx,
        object.height - dy,
      );
    case AnchorIds.bottomRight:
      return calculateScaledBox(object.left, object.top, object.width + dx, object.height + dy);
    case AnchorIds.bottomLeft:
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
