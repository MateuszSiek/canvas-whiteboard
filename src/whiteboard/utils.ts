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

export function getSelectionAnchors(selectedObjects: ObjectData[]): ObjectData[] | undefined {
  if (selectedObjects && selectedObjects.length > 0) {
    const findExtremum = (
      objects: ObjectData[],
      comparator: (a: ObjectData, b: ObjectData) => boolean,
    ) => {
      return objects.reduce((acc, obj) => (comparator(acc!, obj!) ? acc : obj));
    };

    const minTopObject = findExtremum(selectedObjects, (a, b) => a.top < b.top);
    const minLeftObject = findExtremum(selectedObjects, (a, b) => a.left < b.left);
    const maxTopObject = findExtremum(selectedObjects, (a, b) => a.top > b.top);
    const maxRightObject = findExtremum(
      selectedObjects,
      (a, b) => a.left + a.width > b.left + b.width,
    );
    const minTop = minTopObject!.top;
    const minLeft = minLeftObject!.left;
    const maxWidth = maxRightObject!.left + maxRightObject!.width - minLeft;
    const maxHeight = maxTopObject!.top + maxTopObject!.height - minTop;
    const anchors = getAnchorObjects(minTop, minLeft, maxWidth, maxHeight);
    return anchors;
  } else {
    return undefined;
  }
}
