import { ObjectData } from "../types/objects";
import { ShapeRenderer } from "../types/render";

export const Rectangle: ShapeRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = object.color || "black";
    ctx.beginPath();
    ctx.roundRect(object.left, object.top, object.width, object.height, 10);
    ctx.fill();
    ctx.restore();
  },
  renderSelect(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    Rectangle.renderDefault(object, ctx);
  },
};
