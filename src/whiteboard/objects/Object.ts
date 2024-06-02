export enum ObjectType {
  rectangle = "rectangle",
}

export interface ObjectData {
  id: number;
  type: ObjectType;

  top: number;
  left: number;
  width: number;
  height: number;
}

export interface CanvasObject extends ObjectData {
  id: number;
  type: ObjectType;

  top: number;
  left: number;
  width: number;
  height: number;

  setSize: (width: number, height: number) => void;
  setPosition: (top: number, left: number) => void;

  render(ctx: CanvasRenderingContext2D): void;

  renderSelectable(ctx: CanvasRenderingContext2D): void;
}
