import { ObjectData, ObjectType } from "../types/objects";

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

export const initializeCanvasObjects = (): Map<number, ObjectData> => {
  return canvasObjects.reduce((objectsMap, objectData) => {
    objectsMap.set(objectData.id, objectData);
    return objectsMap;
  }, new Map<number, ObjectData>());
};
