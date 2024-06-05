import { ObjectData, ObjectType } from "../types/objects";

export const DEFAULT_OBJECTS: ObjectData[] = [
  {
    id: 1,
    type: ObjectType.rectangle,
    top: 100,
    left: 100,
    width: 100,
    height: 125,
    color: "#fff83b",
  },
  {
    id: 2,
    type: ObjectType.rectangle,
    top: 100,
    left: 205,
    width: 50,
    height: 50,
    color: "#3bff75",
  },
  {
    id: 3,
    type: ObjectType.rectangle,
    top: 230,
    left: 100,
    width: 240,
    height: 100,
    color: "#3bdcff",
  },
  {
    id: 4,
    type: ObjectType.rectangle,
    left: 205,
    top: 155,
    width: 135,
    height: 70,
    color: "#ff62ac",
  },
  {
    id: 5,
    type: ObjectType.rectangle,
    left: 260,
    top: 100,
    width: 80,
    height: 50,
    color: "#ff7762",
  },
];

export const ANCHOR_SIZE = 10;
export const SELECTION_COLOR = "#1395ff";
