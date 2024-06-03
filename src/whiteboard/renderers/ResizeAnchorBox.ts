import { ObjectData } from "../types/objects";
import { ShapeRenderer } from "../types/render";

export const ResizeAnchorBox: ShapeRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "#1395ff";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.restore();
  },
};
