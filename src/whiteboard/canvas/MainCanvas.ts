import { Canvas } from "./Canvas";
import { CanvasObject } from "../objects/Object";

export class MainCanvas<T = {}> extends Canvas<Map<string, CanvasObject>, T> {
  constructor(...args: ConstructorParameters<typeof Canvas<Map<string, CanvasObject>, T>>) {
    super(...args);
  }

  public render() {
    const ctx = this.ctx;
    this.clear();
    const objects = Array.from(this.data.values());
    for (const object of objects) {
      object.render(ctx);
    }
  }
}
