import { ObjectData } from "../types/objects";
import { ObjectRenderer } from "../types/render";

export const Rectangle: ObjectRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "#5f5f5f";
    ctx.fillStyle = object.color || "black";
    ctx.beginPath();
    ctx.roundRect(object.left, object.top, object.width, object.height, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  },
  renderSelect(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    Rectangle.renderDefault(object, ctx);
  },
};
