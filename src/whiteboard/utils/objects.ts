import { ObjectData, ObjectType } from "../types/objects";
import { DEFAULT_OBJECTS } from "./consts";

export function updateRefObjects(
  ref: React.MutableRefObject<Map<number, ObjectData>>,
  objects: ObjectData[],
  updateFunc: (object: ObjectData) => ObjectData,
) {
  objects.forEach((object) => {
    const newObject = updateFunc(object);
    ref.current.set(newObject.id, newObject);
  });
}

export const initializeCanvasObjects = (): Map<number, ObjectData> => {
  return DEFAULT_OBJECTS.reduce((objectsMap, objectData) => {
    objectsMap.set(objectData.id, objectData);
    return objectsMap;
  }, new Map<number, ObjectData>());
};

export const createRandomRectangle = (canvasSize: {
  width: number;
  height: number;
}): ObjectData => {
  const canvasWidth = canvasSize.width;
  const canvasHeight = canvasSize.height;
  const width = 100 + Math.random() * 100;
  const height = 100 + Math.random() * 100;
  const left = Math.random() * canvasWidth * 0.9;
  const top = Math.random() * canvasHeight * 0.9;
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return {
    id: Math.floor(Math.random() * 100000),
    type: ObjectType.rectangle,
    left,
    top,
    width,
    height,
    color,
  };
};
