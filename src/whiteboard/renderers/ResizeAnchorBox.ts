import { ObjectData } from "../types/objects";
import { ObjectRenderer } from "../types/render";
import { SELECTION_COLOR } from "../utils/consts";

export const ResizeAnchorBox: ObjectRenderer = {
  renderDefault(object: ObjectData, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.rect(object.left, object.top, object.width, object.height);
    ctx.stroke();
    ctx.restore();
  },
};
