import { ObjectData } from "../types/objects";
import { ShapeRenderer } from "../types/render";

export const ResizeAnchor: ShapeRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },

  renderSelect(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = object.color || "blue";
    ctx.strokeStyle = object.color || "blue";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },
};
