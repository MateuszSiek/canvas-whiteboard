export enum ObjectType {
  rectangle = "rectangle",
  resizeAnchor = "resizeAnchor",
  resizeAnchorBox = "resizeAnchorBox",
}

export interface ObjectData {
  id: number;
  type: ObjectType;

  top: number;
  left: number;
  width: number;
  height: number;
  color?: string;
}
