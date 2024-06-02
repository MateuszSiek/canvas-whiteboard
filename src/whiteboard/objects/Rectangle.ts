import { ObjectData, ObjectType, CanvasObject } from "./Object";

export class Rectangle implements CanvasObject {
  id: number;
  type = ObjectType.rectangle;
  top: number;
  left: number;
  width: number;
  height: number;

  constructor(data: ObjectData) {
    this.id = data.id;
    this.top = data.top;
    this.left = data.left;
    this.width = data.width;
    this.height = data.height;
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  setPosition(top: number, left: number): void {
    this.top = top;
    this.left = left;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "#3cffba";
    ctx.beginPath();
    ctx.roundRect(this.left, this.top, this.width, this.height, 10);
    ctx.fill();
    ctx.restore();
  }

  renderSelectable(ctx: CanvasRenderingContext2D): void {
    this.render(ctx);
  }
}
