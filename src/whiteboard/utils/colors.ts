export function rgbToHex(r: number, g: number, b: number): string {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function generateColorFromId(id: number): string {
  const hexColor = (id % 0xffffff).toString(16);
  return `#${hexColor.padStart(6, "0")}`;
}
