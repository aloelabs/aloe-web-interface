import { prominent } from 'color.js';

function rgb_to_hsv(rgb: number[]) {
  // R, G, B values are divided by 255
  // to change the range from 0..255 to 0..1
  const r = rgb[0] / 255.0;
  const g = rgb[1] / 255.0;
  const b = rgb[2] / 255.0;

  // h, s, v = hue, saturation, value
  var cmax = Math.max(r, Math.max(g, b)); // maximum of r, g, b
  var cmin = Math.min(r, Math.min(g, b)); // minimum of r, g, b
  var diff = cmax - cmin; // diff of cmax and cmin.
  var h = -1,
    s = -1;

  // if cmax and cmax are equal then h = 0
  if (cmax == cmin) h = 0;
  // if cmax equal r then compute h
  else if (cmax == r) h = (60 * ((g - b) / diff) + 360) % 360;
  // if cmax equal g then compute h
  else if (cmax == g) h = (60 * ((b - r) / diff) + 120) % 360;
  // if cmax equal b then compute h
  else if (cmax == b) h = (60 * ((r - g) / diff) + 240) % 360;

  // if cmax equal zero
  if (cmax == 0) s = 0;
  else s = (diff / cmax) * 100;

  // compute v
  var v = cmax * 100;
  return [h, s, v]
}

export async function getProminentColor(path: string) {
  const colorsRGB: number[][] = await prominent(path, { amount: 3 }) as number[][];
  const colors = colorsRGB.map((colorRGB) => {
    return {
      'rgb': colorRGB,
      'hsv': rgb_to_hsv(colorRGB),
    };
  });

  // Prioritize things that are more colorful over things that are black/white.
  // If everything is black/white, prioritize white.
  const score = (hsv: number[]) => {
    return 0.9 * hsv[1] + 0.1 * (hsv[2]); // use (1 - hsv[2]) if we want to prioritize darker colors instead of lighter ones
  }

  const bestColor = colors.sort((a, b) => score(b.hsv) - score(a.hsv))[0];
  return `${bestColor.rgb[0]}, ${bestColor.rgb[1]}, ${bestColor.rgb[2]}`;
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
