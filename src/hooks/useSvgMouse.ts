import { useState, useCallback, type RefObject } from 'react';
import { CELL_PX } from '../constants';

interface GridPos {
  col: number;
  row: number;
}

export function useSvgMouse(svgRef: RefObject<SVGSVGElement | null>) {
  const [gridPos, setGridPos] = useState<GridPos | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgPt = pt.matrixTransform(ctm.inverse());
    setGridPos({
      col: Math.floor(svgPt.x / CELL_PX),
      row: Math.floor(svgPt.y / CELL_PX),
    });
  }, [svgRef]);

  const handleMouseLeave = useCallback(() => {
    setGridPos(null);
  }, []);

  return { gridPos, handleMouseMove, handleMouseLeave };
}
