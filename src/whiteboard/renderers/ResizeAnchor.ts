import { ObjectData } from "../types/objects";
import { ObjectRenderer } from "../types/render";
import { SELECTION_COLOR } from "../utils/consts";

export const ResizeAnchor: ObjectRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },

  renderSelect(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = object.color || "";
    ctx.strokeStyle = object.color || "";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },
};
