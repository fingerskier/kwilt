import type { Tile } from '../types';
import { tileToSvgPoints } from '../geometry';

interface Props {
  tile: Tile;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function SvgTile({ tile, isSelected, onClick }: Props) {
  return (
    <polygon
      points={tileToSvgPoints(tile)}
      fill={tile.color}
      stroke={isSelected ? '#ff6600' : '#333'}
      strokeWidth={isSelected ? 2.5 : 1}
      strokeDasharray={isSelected ? '6 3' : undefined}
      style={{ cursor: 'pointer' }}
      onClick={(e) => { e.stopPropagation(); onClick(tile.id); }}
    />
  );
}
