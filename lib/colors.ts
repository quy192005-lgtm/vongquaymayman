export const SLICE_PALETTE = [
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#a855f7', // Purple
  '#84cc16', // Lime
  '#e11d48', // Crimson
];

/**
 * Returns readable text color (#ffffff or #0f172a) based on hex background luminance
 */
export function getContrastTextColor(hexColor: string): string {
  // Normalize hex
  let c = hexColor.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) return '#ffffff';

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // Perceived brightness formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0f172a' : '#ffffff';
}

/**
 * Get next available color from the palette
 */
export function getPaletteColor(index: number): string {
  return SLICE_PALETTE[index % SLICE_PALETTE.length];
}

