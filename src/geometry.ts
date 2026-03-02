import type { Tile } from './types';
import { CELL_PX } from './constants';

export function tileToSvgPoints(tile: Tile): string {
  const x = tile.col * CELL_PX;
  const y = tile.row * CELL_PX;
  const s = tile.size * CELL_PX;

  switch (tile.shape) {
    case 'square':
      return `${x},${y} ${x + s},${y} ${x + s},${y + s} ${x},${y + s}`;

    case 'right-triangle':
      switch (tile.orientation) {
        case 0: return `${x},${y} ${x + s},${y} ${x},${y + s}`;
        case 1: return `${x},${y} ${x + s},${y} ${x + s},${y + s}`;
        case 2: return `${x + s},${y} ${x + s},${y + s} ${x},${y + s}`;
        case 3: return `${x},${y} ${x + s},${y + s} ${x},${y + s}`;
      }
      break;

    case 'rectangle': {
      const half = s / 2;
      if (tile.orientation === 0 || tile.orientation === 2) {
        return `${x},${y} ${x + s},${y} ${x + s},${y + half} ${x},${y + half}`;
      } else {
        return `${x},${y} ${x + half},${y} ${x + half},${y + s} ${x},${y + s}`;
      }
    }

    case 'parallelogram': {
      const offset = s / 4;
      if (tile.orientation === 0 || tile.orientation === 2) {
        return `${x + offset},${y} ${x + s},${y} ${x + s - offset},${y + s} ${x},${y + s}`;
      } else {
        return `${x},${y} ${x + s - offset},${y} ${x + s},${y + s} ${x + offset},${y + s}`;
      }
    }
  }
  return '';
}

export function tileFitsInBlock(col: number, row: number, size: number, blockSize: number, shape: Tile['shape'], orientation: Tile['orientation']): boolean {
  if (col < 0 || row < 0) return false;

  switch (shape) {
    case 'square':
      return col + size <= blockSize && row + size <= blockSize;
    case 'right-triangle':
      return col + size <= blockSize && row + size <= blockSize;
    case 'rectangle':
      if (orientation === 0 || orientation === 2) {
        return col + size <= blockSize && row + Math.ceil(size / 2) <= blockSize;
      } else {
        return col + Math.ceil(size / 2) <= blockSize && row + size <= blockSize;
      }
    case 'parallelogram':
      return col + size <= blockSize && row + size <= blockSize;
  }
}
