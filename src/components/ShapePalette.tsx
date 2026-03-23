import type { TileShape } from '../types';
import styles from './ShapePalette.module.css';

interface Props {
  selected: TileShape;
  onSelect: (shape: TileShape) => void;
}

const shapes: { shape: TileShape; label: string; path: string }[] = [
  { shape: 'square', label: 'Square', path: 'M4,4 L28,4 L28,28 L4,28 Z' },
  { shape: 'right-triangle', label: 'Triangle', path: 'M4,4 L28,4 L4,28 Z' },
  { shape: 'rectangle', label: 'Rectangle', path: 'M4,8 L28,8 L28,24 L4,24 Z' },
  { shape: 'parallelogram', label: 'Parallelogram', path: 'M16,6 L28,6 L16,18 L4,18 Z' },
];

export default function ShapePalette({ selected, onSelect }: Props) {
  return (
    <div className={styles.palette}>
      <label className={styles.label}>Shape</label>
      <div className={styles.grid}>
        {shapes.map(({ shape, label, path }) => (
          <button
            key={shape}
            className={`${styles.btn} ${selected === shape ? styles.active : ''}`}
            onClick={() => onSelect(shape)}
            title={label}
          >
            <svg viewBox="0 0 32 32" width={32} height={32}>
              <path d={path} fill="#5b8c5a" stroke="#333" strokeWidth={1.5} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
