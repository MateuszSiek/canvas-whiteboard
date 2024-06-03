import { Rectangle } from "./Rectangle";
import { ResizeAnchor } from "./ResizeAnchor";
import { ResizeAnchorBox } from "./ResizeAnchorBox";

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

export enum RendererType {
  default = "default",
  selectable = "selectable",
}

export interface ShapeRenderer {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void;
  renderSelect?(object: ObjectData, ctx: CanvasRenderingContext2D): void;
}

const objectRenderers: { [key in ObjectType]: ShapeRenderer } = {
  [ObjectType.rectangle]: Rectangle,
  [ObjectType.resizeAnchor]: ResizeAnchor,
  [ObjectType.resizeAnchorBox]: ResizeAnchorBox,
};

export function render(
  object: ObjectData,
  ctx: CanvasRenderingContext2D,
  rendererType: RendererType = RendererType.default,
): void {
  const renderer = objectRenderers[object.type];

  if (rendererType === RendererType.selectable && renderer.renderSelect) {
    renderer.renderSelect(object, ctx);
  } else if (rendererType === RendererType.default) {
    renderer.renderDefault(object, ctx);
  }
}
