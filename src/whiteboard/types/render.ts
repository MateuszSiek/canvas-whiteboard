import { ObjectData } from "./objects";

export enum RendererType {
  default = "default",
  selectable = "selectable",
}

export interface ShapeRenderer {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void;
  renderSelect?(object: ObjectData, ctx: CanvasRenderingContext2D): void;
}
