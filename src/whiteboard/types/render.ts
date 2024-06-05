import { ObjectData } from "./objects";

export enum RendererType {
  default = "default",
  selectable = "selectable",
}

export interface ObjectRenderer {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void;
  // obejcts can have a different render for selectable state
  renderSelect?(object: ObjectData, ctx: CanvasRenderingContext2D): void;
}
