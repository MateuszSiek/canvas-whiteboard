import { Canvas } from "./Canvas";

export class MainCanvas extends Canvas<{}> {
  constructor(...args: ConstructorParameters<typeof Canvas<{}>>) {
    super(...args);
  }
}
