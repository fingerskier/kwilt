export type TileShape = 'square' | 'right-triangle' | 'parallelogram' | 'rectangle';

export type Orientation = 0 | 1 | 2 | 3;

export interface Tile {
  id: string;
  shape: TileShape;
  col: number;
  row: number;
  size: number;
  orientation: Orientation;
  color: string;
}

export interface Block {
  id: string;
  name: string;
  blockSize: number;
  tiles: Tile[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  block: Block;
  palette: string[];
}
