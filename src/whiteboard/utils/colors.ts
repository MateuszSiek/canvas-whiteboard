export function rgbToHex(r: number, g: number, b: number): string {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// simple function to generate color based on the ID
export function generateColorFromId(id: number): string {
  const hexColor = (id % 0xffffff).toString(16);
  return `#${hexColor.padStart(6, "0")}`;
}

// get hex color value at a given x,y coordinate on the canvas
export function getCanvasPixelColor(
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
): string {
  const p = ctx.getImageData(x, y, 1, 1).data;
  const color = rgbToHex(p[0], p[1], p[2]);
  return color;
}
