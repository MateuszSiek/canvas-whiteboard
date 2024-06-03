import { ObjectData, render, renderer } from "../objects/Object";

export interface CanvasDefinition<T> {
  clear(): void;
  setObjects(objects: Map<number, ObjectData>): void;
  render(): void;
  addEventListener<E extends EventName<T>>(event: E, callback: EventCallback<T, E>): void;
  removeEventListener<E extends EventName<T>>(event: E, callback: EventCallback<T, E>): void;
  destroy(): void;
}

export interface CanvasConstructorParameters {
  element: HTMLCanvasElement;
  width: number;
  height: number;
  objects: Map<number, ObjectData>;
}

type EventName<T> = keyof T;
type EventCallback<T, E extends EventName<T>> = T[E] extends (...args: any) => any ? T[E] : never;

export class Canvas<T = {}> implements CanvasDefinition<T> {
  protected canvasElement: HTMLCanvasElement;
  protected data: Map<number, ObjectData>;
  protected dpr: number;
  protected ctx: CanvasRenderingContext2D;

  protected eventListeners: Map<EventName<T>, Array<EventCallback<T, any>>> = new Map();

  constructor({ element, width, height, objects }: CanvasConstructorParameters) {
    this.canvasElement = element;
    this.data = objects;

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

  public setObjects(data: Map<number, ObjectData>): void {
    this.data = data;
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = Array.from(this.data.values());
    for (const object of objects) {
      render(object, ctx);
    }
  }

  // Event handling methods
  public addEventListener<E extends EventName<T>>(event: E, callback: EventCallback<T, E>): void {
    const listeners = this.eventListeners.get(event) || [];
    this.eventListeners.set(event, [...listeners, callback] as Array<EventCallback<T, E>>);
  }

  public removeEventListener<E extends EventName<T>>(
    event: E,
    callback: EventCallback<T, E>,
  ): void {
    const listeners = this.eventListeners.get(event) || [];
    const updatedListeners = listeners.filter((cb) => cb !== callback);
    this.eventListeners.set(event, updatedListeners as Array<EventCallback<T, E>>);
  }

  protected emit<E extends EventName<T>>(event: E, ...args: Parameters<EventCallback<T, E>>): void {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;

    listeners.forEach((callback) => callback(...args));
  }

  public destroy(): void {
    this.eventListeners.clear();
  }
}
