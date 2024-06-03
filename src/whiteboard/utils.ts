import { MouseDragData } from "./canvas/SelectionCanvas";
import { ObjectData, ObjectType } from "./objects/Object";

export function generateColorFromId(id: number): string {
  const hexColor = (id % 0xffffff).toString(16);
  return `#${hexColor.padStart(6, "0")}`;
}

export const initializeCanvasObjects = (objects: ObjectData[]): Map<number, ObjectData> => {
  return objects.reduce((objectsMap, objectData) => {
    objectsMap.set(objectData.id, objectData);
    return objectsMap;
  }, new Map<number, ObjectData>());
};

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
  return [
    {
      id: AnchorIds.box,
      type: ObjectType.resizeAnchorBox,
      top: top,
      left: left,
      width: width,
      height: height,
    },
    {
      id: AnchorIds.topLeft,
      type: ObjectType.resizeAnchor,
      top: top - anchorSize / 2,
      left: left - anchorSize / 2,
      width: anchorSize,
      height: anchorSize,
    },
    {
      id: AnchorIds.topRight,
      type: ObjectType.resizeAnchor,
      top: top - anchorSize / 2,
      left: left + width - anchorSize / 2,
      width: anchorSize,
      height: anchorSize,
    },
    {
      id: AnchorIds.bottomRight,
      type: ObjectType.resizeAnchor,
      top: top + height - anchorSize / 2,
      left: left + width - anchorSize / 2,
      width: anchorSize,
      height: anchorSize,
    },
    {
      id: AnchorIds.bottomLeft,
      type: ObjectType.resizeAnchor,
      top: top + height - anchorSize / 2,
      left: left - anchorSize / 2,
      width: anchorSize,
      height: anchorSize,
    },
  ];
}

export function updateAnchorMap(data: Map<number, ObjectData>, anchors?: ObjectData[]): void {
  if (anchors) {
    anchors.forEach((anchor) => {
      data.set(anchor.id, anchor);
    });
  } else {
    Object.keys(AnchorIds)
      .filter((v) => !isNaN(Number(v)))
      .map(Number)
      .forEach((id) => {
        data.delete(id);
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
  wrapperBox: ObjectData,
  initialBox: ObjectData,
  object: ObjectData,
): ObjectData {
  const scaleX = wrapperBox.width / initialBox.width;
  const scaleY = wrapperBox.height / initialBox.height;

  const newLeft = wrapperBox.left + (object.left - initialBox.left) * scaleX;
  const newTop = wrapperBox.top + (object.top - initialBox.top) * scaleY;
  const newWidth = object.width * scaleX;
  const newHeight = object.height * scaleY;

  return {
    ...object,
    left: newLeft,
    top: newTop,
    width: newWidth,
    height: newHeight,
  };
}

export function dragScaleObject(
  mouseDrag: MouseDragData,
  anchor: ObjectData,
  object: ObjectData,
): ObjectData {
  const { dx, dy } = mouseDrag;
  let scaledSelectionBox = object;
  switch (anchor.id) {
    case AnchorIds.topLeft:
      scaledSelectionBox = {
        ...object,
        top: object.top + dy,
        left: object.left + dx,
        width: object.width - dx,
        height: object.height - dy,
      };
      break;
    case AnchorIds.topRight:
      scaledSelectionBox = {
        ...object,
        top: object.top + dy,
        width: object.width + dx,
        height: object.height - dy,
      };
      break;
    case AnchorIds.bottomRight:
      scaledSelectionBox = {
        ...object,
        width: object.width + dx,
        height: object.height + dy,
      };
      break;
    case AnchorIds.bottomLeft:
      scaledSelectionBox = {
        ...object,
        left: object.left + dx,
        width: object.width - dx,
        height: object.height + dy,
      };
      break;
  }
  return scaledSelectionBox;
}
