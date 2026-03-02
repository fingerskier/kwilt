import { CELL_PX } from '../constants';

interface Props {
  blockSize: number;
}

export default function SvgGrid({ blockSize }: Props) {
  const total = blockSize * CELL_PX;
  const lines: React.ReactNode[] = [];

  for (let i = 0; i <= blockSize; i++) {
    const pos = i * CELL_PX;
    const isBorder = i === 0 || i === blockSize;
    lines.push(
      <line key={`h${i}`} x1={0} y1={pos} x2={total} y2={pos}
        stroke="#bbb" strokeWidth={isBorder ? 2 : 0.5} />,
      <line key={`v${i}`} x1={pos} y1={0} x2={pos} y2={total}
        stroke="#bbb" strokeWidth={isBorder ? 2 : 0.5} />,
    );
  }

  return <g className="grid">{lines}</g>;
}
