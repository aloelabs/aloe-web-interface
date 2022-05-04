import { prominent } from 'color.js';

export async function getProminentColor(path: string) {
  const values = await prominent(path, { amount: 1 });
  return `${values[0]}, ${values[1]}, ${values[2]}`;
}

export function rgb(color: string) {
  return `rgb(${color})`;
}

export function rgba(color: string, alpha: number) {
  return `rgba(${color}, ${alpha})`;
}

export function getBrighterColor(color0: string, color1: string) {
  const values0 = color0.split(',').map((v) => parseInt(v.trim()));
  const values1 = color1.split(',').map((v) => parseInt(v.trim()));
  const avg0 = (values0[0] + values0[1] + values0[2]) / 3;
  const avg1 = (values1[0] + values1[1] + values1[2]) / 3;
  return avg0 > avg1 ? color0 : color1;
}
