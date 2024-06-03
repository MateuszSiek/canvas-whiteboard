import { throttle } from "throttle-debounce";
import { Canvas, CanvasConstructorParameters } from "./Canvas";
import { generateColorFromId } from "../utils";
import { ObjectType, RendererType, render } from "../objects/Object";

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

interface SelectCanvasEventMap {
  objectHover: (id?: number) => void;
  objectsSelect: (ids?: number[]) => void;
}

export class SelectionCanvas extends Canvas<SelectCanvasEventMap> {
  private hoveredObjectId: number | undefined;
  private selectedObjectsIds: number[] = [];
  private colorToId: Map<string, number> = new Map();

  constructor({ element, width, height, objects }: CanvasConstructorParameters) {
    super({
      element,
      width,
      height,
      objects,
    });

    const mouseMove = throttle(100, (e) => {
      this.handleMousemove(e);
    });

    this.canvasElement.addEventListener("mousemove", mouseMove);
    this.canvasElement.addEventListener("mousedown", (e) => {
      this.handleClick(e);
    });
  }

  public destroy(): void {
    this.eventListeners.clear();
    this.canvasElement.removeEventListener("mousemove", () => {});
    this.canvasElement.removeEventListener("mousedown", () => {});
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = Array.from(this.data.values());
    this.colorToId = new Map();
    for (const object of objects) {
      const color = generateColorFromId(object.id);
      this.colorToId.set(color, object.id);
      render({ ...object, color }, ctx, RendererType.selectable);
    }
  }

  private handleClick(e: MouseEvent) {
    const clickedObject =
      this.hoveredObjectId !== undefined ? this.data.get(this.hoveredObjectId) : undefined;
    if (clickedObject?.type === ObjectType.resizeAnchor) {
      this.handleAnchorSelectEvent(e);
    } else {
      this.handleObjectSelectEvent(e);
    }
  }

  private handleAnchorSelectEvent(e: MouseEvent) {}

  private handleObjectSelectEvent(e: MouseEvent) {
    if (!this.hoveredObjectId) {
      // no object was clicked
      this.selectedObjectsIds = [];
    } else if (e.shiftKey) {
      if (this.selectedObjectsIds.includes(this.hoveredObjectId)) {
        // shift key + click on already selected object: remove it from selection
        this.selectedObjectsIds = this.selectedObjectsIds.filter(
          (id) => id !== this.hoveredObjectId,
        );
      } else {
        // shift key + click on object: add it to selection
        const uniqueIds = new Set<number>([...this.selectedObjectsIds, this.hoveredObjectId!]);
        this.selectedObjectsIds = Array.from(uniqueIds);
      }
    } else {
      // click on already selected object: do nothing
      if (this.selectedObjectsIds.includes(this.hoveredObjectId)) {
        return;
      }
      // click on object: select it
      this.selectedObjectsIds = [this.hoveredObjectId!];
    }
    this.emit("objectsSelect", this.selectedObjectsIds);
  }

  private handleMousemove(e: MouseEvent) {
    const { x, y } = getMousePos(this.canvasElement, e);
    const p = this.ctx.getImageData(x, y, 1, 1).data;
    const color = rgbToHex(p[0], p[1], p[2]);
    const id = this.colorToId?.get(color);
    if (this.hoveredObjectId !== id) {
      this.emit("objectHover", id);
    }
    this.hoveredObjectId = id;
  }
}
