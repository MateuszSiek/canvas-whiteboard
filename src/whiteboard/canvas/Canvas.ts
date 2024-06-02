import { CanvasObject } from "../objects/Object";

export interface Viewport {
  top: number;
  left: number;
  width: number;
  height: number;
}

export class Canvas {
  private canvasElement: HTMLCanvasElement;
  private objects: Map<string, CanvasObject>;
  private dpr: number;
  private ctx: CanvasRenderingContext2D;

  constructor(
    {
      element,
      width,
      height,
    }: { element: HTMLCanvasElement; width: number; height: number },
    objects: Map<string, CanvasObject>,
  ) {
    this.canvasElement = element;
    this.objects = objects;

    this.dpr = window.devicePixelRatio ?? 1;
    this.canvasElement.setAttribute("width", (width * this.dpr).toString());
    this.canvasElement.setAttribute("height", (height * this.dpr).toString());

    this.canvasElement.style.width = width + "px";
    this.canvasElement.style.height = height + "px";

    const ctx = this.canvasElement.getContext("2d");
    if (ctx === null) {
      throw new Error("Could not get canvas context");
    }
    this.ctx = ctx;
    ctx.scale(this.dpr, this.dpr);
  }

  public clear(): void {
    let ctx = this.ctx;
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.restore();
  }

  public setObjects(objects: Map<string, CanvasObject>): void {
    this.objects = objects;
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = Array.from(this.objects.values());
    for (const object of objects) {
      object.render(ctx);
    }
  }
}
