import { rgbToHex } from "./colors";

export function getPixelColor(
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
): string {
  const p = ctx.getImageData(x, y, 1, 1).data;
  const color = rgbToHex(p[0], p[1], p[2]);
  return color;
}
