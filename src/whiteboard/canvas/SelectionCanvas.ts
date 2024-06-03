import { Canvas, CanvasConstructorParameters } from "./Canvas";
import { generateColorFromId } from "../utils";
import { ObjectData, RendererType, render } from "../objects/Object";

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

export interface MouseDragData {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface SelectCanvasEventMap {
  objectsSelect: (ids?: number[]) => void;
  uiObjectSelect: (id?: number) => void;
  mouseDrag: (e: MouseDragData) => void;
  mouseDragEnd: () => void;
  mouseDragStart: () => void;
}

export class SelectionCanvas extends Canvas<SelectCanvasEventMap> {
  private selectedObjectsIds: number[] = [];
  private selectedAnchorId: number | undefined;
  private colorToId: Map<string, number> = new Map();

  private uiObjects: Map<number, ObjectData>;

  private isMouseDown = false;
  private isDragging = false;
  private initialMousePos: { x: number; y: number } = { x: 0, y: 0 };

  constructor({
    uiObjects,
    ...args
  }: { uiObjects: Map<number, ObjectData> } & CanvasConstructorParameters) {
    super(args);

    this.uiObjects = uiObjects;
    this.canvasElement.addEventListener("mousemove", (e) => {
      if (this.isMouseDown) {
        const { x, y } = getMousePos(this.canvasElement, e);
        const dx = (x - this.initialMousePos.x) / this.dpr;
        const dy = (y - this.initialMousePos.y) / this.dpr;
        if (!this.isDragging) {
          this.isDragging = true;
          this.emit("mouseDragStart");
        }
        this.emit("mouseDrag", { x, y, dx, dy });
      }
    });

    this.canvasElement.addEventListener("mousedown", (e) => {
      this.isMouseDown = true;
      this.initialMousePos = getMousePos(this.canvasElement, e);
      this.handleClick(e);
    });

    this.canvasElement.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.emit("mouseDragEnd");
      }
      this.isMouseDown = false;
    });
  }

  public destroy(): void {
    this.eventListeners.clear();
    this.canvasElement.removeEventListener("mousemove", () => {});
    this.canvasElement.removeEventListener("mousedown", () => {});
    this.canvasElement.removeEventListener("mouseup", () => {});
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = Array.from(this.data.values());
    const uiObjects = Array.from(this.uiObjects.values());
    this.colorToId = new Map();
    for (const object of [...objects, ...uiObjects]) {
      const color = generateColorFromId(object.id);
      this.colorToId.set(color, object.id);
      render({ ...object, color }, ctx, RendererType.selectable);
    }
  }

  private handleClick(e: MouseEvent) {
    const { x, y } = getMousePos(this.canvasElement, e);
    const p = this.ctx.getImageData(x, y, 1, 1).data;
    const color = rgbToHex(p[0], p[1], p[2]);
    const id = this.colorToId?.get(color);
    const clickedUiObject = id !== undefined ? this.uiObjects.get(id) : undefined;

    if (clickedUiObject) {
      this.handleAnchorSelectEvent(id);
    } else {
      this.handleObjectSelectEvent(id, e.shiftKey);
    }
  }

  private handleAnchorSelectEvent(id: number | undefined) {
    this.selectedAnchorId = id;
    this.emit("uiObjectSelect", id);
    this.emit("objectsSelect", this.selectedObjectsIds);
  }

  private handleObjectSelectEvent(id: number | undefined, shiftKey: boolean) {
    if (!id) {
      // no object was clicked
      this.selectedObjectsIds = [];
    } else if (shiftKey) {
      if (this.selectedObjectsIds.includes(id)) {
        // shift key + click on already selected object: remove it from selection
        this.selectedObjectsIds = this.selectedObjectsIds.filter((i) => i !== id);
      } else {
        // shift key + click on object: add it to selection
        const uniqueIds = new Set<number>([...this.selectedObjectsIds, id]);
        this.selectedObjectsIds = Array.from(uniqueIds);
      }
    } else {
      // click on object: select it
      if (!this.selectedObjectsIds.includes(id)) {
        this.selectedObjectsIds = [id!];
      }
    }
    this.emit("uiObjectSelect", undefined);
    this.emit("objectsSelect", this.selectedObjectsIds);
  }
}
