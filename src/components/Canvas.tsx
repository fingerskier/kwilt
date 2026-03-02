import { useRef, useCallback } from 'react';
import { useAppContext } from '../state/context';
import { useSvgMouse } from '../hooks/useSvgMouse';
import { tileFitsInBlock } from '../geometry';
import { CELL_PX } from '../constants';
import SvgGrid from './SvgGrid';
import SvgTile from './SvgTile';
import GhostTile from './GhostTile';
import styles from './Canvas.module.css';

export default function Canvas() {
  const {
    project, tilesHistory, toolState, setToolState,
    placeTile, removeTile, updateTile,
  } = useAppContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const { gridPos, handleMouseMove, handleMouseLeave } = useSvgMouse(svgRef);

  const blockSize = project.block.blockSize;
  const totalPx = blockSize * CELL_PX;
  const tiles = tilesHistory.present;
  const { selectedShape, selectedSize, selectedOrientation, selectedColor, selectedTileId } = toolState;

  const showGhost = gridPos !== null &&
    tileFitsInBlock(gridPos.col, gridPos.row, selectedSize, blockSize, selectedShape, selectedOrientation);

  const handleCanvasClick = useCallback(() => {
    if (selectedTileId) {
      setToolState(s => ({ ...s, selectedTileId: null }));
      return;
    }
    if (gridPos && showGhost) {
      placeTile(gridPos.col, gridPos.row);
    }
  }, [gridPos, showGhost, selectedTileId, placeTile, setToolState]);

  const handleTileClick = useCallback((id: string) => {
    if (selectedTileId === id) {
      // Clicking the selected tile recolors it
      updateTile(id, { color: selectedColor });
      return;
    }
    setToolState(s => ({ ...s, selectedTileId: id }));
  }, [selectedTileId, selectedColor, updateTile, setToolState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedTileId) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      removeTile(selectedTileId);
      setToolState(s => ({ ...s, selectedTileId: null }));
    }
  }, [selectedTileId, removeTile, setToolState]);

  return (
    <div className={styles.canvasArea} tabIndex={0} onKeyDown={handleKeyDown}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${totalPx} ${totalPx}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCanvasClick}
      >
        <rect width={totalPx} height={totalPx} fill="#f9f6f2" />
        <SvgGrid blockSize={blockSize} />
        {tiles.map(tile => (
          <SvgTile
            key={tile.id}
            tile={tile}
            isSelected={tile.id === selectedTileId}
            onClick={handleTileClick}
          />
        ))}
        {showGhost && gridPos && (
          <GhostTile
            col={gridPos.col}
            row={gridPos.row}
            size={selectedSize}
            shape={selectedShape}
            orientation={selectedOrientation}
            color={selectedColor}
          />
        )}
      </svg>
    </div>
  );
}
