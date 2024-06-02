import { throttle } from "throttle-debounce";
import { MainCanvas } from "./MainCanvas";

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

function generateColorFromId(id: number): string {
  const hexColor = (id % 0xffffff).toString(16);
  return `#${hexColor.padStart(6, "0")}`;
}

interface SelectCanvasEventMap {
  objectHover: (id?: number) => void;
  objectsSelect: (ids?: number[]) => void;
}

export class SelectionCanvas extends MainCanvas<SelectCanvasEventMap> {
  private hoveredObjectId: number | undefined;
  private selectedObjectsIds: number[] = [];

  constructor(...args: ConstructorParameters<typeof MainCanvas<SelectCanvasEventMap>>) {
    super(...args);

    const objects = Array.from(this.data.values()).map((object) => {
      object.color = generateColorFromId(object.id);
      return object;
    });

    this.data = new Map(objects.map((object) => [object.color, object]));

    // implement mouse move events
    const mouseMove = throttle(100, (e) => {
      const { x, y } = getMousePos(this.canvasElement, e);
      const p = this.ctx.getImageData(x, y, 1, 1).data;
      const color = rgbToHex(p[0], p[1], p[2]);
      const selected = this.data.get(color);
      const id = selected?.id;
      if (this.hoveredObjectId !== id) {
        this.emit("objectHover", id);
      }
      this.hoveredObjectId = id;
    });

    this.canvasElement.addEventListener("mousemove", mouseMove);
    this.canvasElement.addEventListener("click", () => {
      this.selectedObjectsIds = this.hoveredObjectId ? [this.hoveredObjectId] : [];
      this.emit("objectsSelect", this.selectedObjectsIds);
    });
  }

  public destroy(): void {
    this.eventListeners.clear();
    this.canvasElement.removeEventListener("mousemove", () => {});
    this.canvasElement.removeEventListener("click", () => {});
  }
}
