import type { Tile, TileShape } from '../types';

export interface CutListEntry {
  shape: TileShape;
  size: number;
  color: string;
  count: number;
}

export function generateCutList(tiles: Tile[]): CutListEntry[] {
  const map = new Map<string, CutListEntry>();
  for (const tile of tiles) {
    const key = `${tile.shape}-${tile.size}-${tile.color}`;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } else {
      map.set(key, { shape: tile.shape, size: tile.size, color: tile.color, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.shape.localeCompare(b.shape) || a.size - b.size || a.color.localeCompare(b.color)
  );
}
