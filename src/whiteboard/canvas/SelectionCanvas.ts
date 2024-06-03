import { Canvas, CanvasConstructorParameters } from "./Canvas";
import { generateColorFromId, getCanvasPixelColor } from "../utils/colors";
import { getDiffMousePos, getMousePos } from "../utils/mouse";
import { ObjectData } from "../types/objects";
import { render } from "../renderers/render";
import { MouseDiffPosition, MousePosition } from "../types/mouse";
import { RendererType } from "../types/render";

export enum SelectionEventType {
  objectsSelect = "objectsSelect",
  anchorSelect = "anchorSelect",
  mouseDrag = "mouseDrag",
  mouseDragEnd = "mouseDragEnd",
  mouseDragStart = "mouseDragStart",
}

interface SelectCanvasEventMap {
  [SelectionEventType.objectsSelect]: (ids?: number[]) => void;
  [SelectionEventType.anchorSelect]: (id?: number) => void;
  [SelectionEventType.mouseDrag]: (e: MouseDiffPosition) => void;
  [SelectionEventType.mouseDragEnd]: () => void;
  [SelectionEventType.mouseDragStart]: () => void;
}

export class SelectionCanvas extends Canvas<SelectCanvasEventMap> {
  private selectedObjectsIds: number[] = [];
  private colorToId: Map<string, number> = new Map();

  private uiObjects: Map<number, ObjectData>;

  private isMouseDown = false;
  private isDragging = false;
  private initialMousePos: MousePosition = { x: 0, y: 0 };

  constructor({
    uiObjects,
    ...args
  }: { uiObjects: Map<number, ObjectData> } & CanvasConstructorParameters) {
    super(args);

    this.uiObjects = uiObjects;
    this.addMouseListeners();
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = [...this.data.values(), ...this.uiObjects.values()];
    this.colorToId.clear();
    objects.forEach((object) => {
      const color = generateColorFromId(object.id);
      this.colorToId.set(color, object.id);
      render({ ...object, color }, ctx, RendererType.selectable);
    });
  }

  public destroy(): void {
    this.eventListeners.clear();
    this.canvasElement.removeEventListener("mousemove", this.handleMouseMove);
    this.canvasElement.removeEventListener("mousedown", this.handleMouseDown);
    this.canvasElement.removeEventListener("mouseup", this.handleMouseUp);
  }

  private addMouseListeners() {
    this.canvasElement.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvasElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvasElement.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.isMouseDown) {
      const pos = getDiffMousePos(this.canvasElement, e, this.initialMousePos, this.dpr);
      if (!this.isDragging) {
        this.isDragging = true;
        this.emit(SelectionEventType.mouseDragStart);
      }
      this.emit(SelectionEventType.mouseDrag, pos);
    }
  }

  private handleMouseDown(e: MouseEvent) {
    this.isMouseDown = true;

    this.initialMousePos = getMousePos(this.canvasElement, e);

    const color = getCanvasPixelColor(this.ctx, this.initialMousePos);
    const id = this.colorToId?.get(color);
    const clickedUiObject = id !== undefined ? this.uiObjects.get(id) : undefined;

    if (clickedUiObject) {
      this.handleAnchorSelectEvent(id);
    } else {
      this.handleObjectSelectEvent(id, e.shiftKey);
    }
  }

  private handleAnchorSelectEvent(id: number | undefined) {
    this.emit(SelectionEventType.anchorSelect, id);
    this.emit(SelectionEventType.objectsSelect, this.selectedObjectsIds);
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
    this.emit(SelectionEventType.anchorSelect, undefined);
    this.emit(SelectionEventType.objectsSelect, this.selectedObjectsIds);
  }

  private handleMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.emit(SelectionEventType.mouseDragEnd);
    }
    this.isMouseDown = false;
  }
}
