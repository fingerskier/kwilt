import type { TileShape, Orientation } from '../types';
import { tileToSvgPoints } from '../geometry';

interface Props {
  col: number;
  row: number;
  size: number;
  shape: TileShape;
  orientation: Orientation;
  color: string;
}

export default function GhostTile({ col, row, size, shape, orientation, color }: Props) {
  const points = tileToSvgPoints({ id: '', col, row, size, shape, orientation, color });
  return (
    <polygon
      points={points}
      fill={color}
      opacity={0.4}
      stroke="#666"
      strokeWidth={1}
      strokeDasharray="4 2"
      pointerEvents="none"
    />
  );
}
