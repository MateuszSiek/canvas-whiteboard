import { ObjectData, ObjectType } from "../types/objects";
import { RendererType, ShapeRenderer } from "../types/render";
import { Rectangle } from "./Rectangle";
import { ResizeAnchor } from "./ResizeAnchor";
import { ResizeAnchorBox } from "./ResizeAnchorBox";

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
