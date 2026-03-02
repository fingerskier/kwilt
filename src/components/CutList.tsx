import { useMemo } from 'react';
import { useAppContext } from '../state/context';
import { generateCutList } from '../utils/cutList';
import { tileToSvgPoints } from '../geometry';
import styles from './CutList.module.css';

const SHAPE_LABELS: Record<string, string> = {
  'square': 'Square',
  'right-triangle': 'Triangle',
  'rectangle': 'Rectangle',
  'parallelogram': 'Parallelogram',
};

export default function CutList() {
  const { tilesHistory } = useAppContext();
  const tiles = tilesHistory.present;
  const entries = useMemo(() => generateCutList(tiles), [tiles]);

  if (entries.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Cut List</h2>
        <p className={styles.empty}>No tiles placed yet</p>
      </aside>
    );
  }

  const totalPieces = entries.reduce((sum, e) => sum + e.count, 0);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Cut List</h2>
      <div className={styles.list}>
        {entries.map((entry, i) => {
          const previewTile = {
            id: '', col: 0, row: 0,
            size: 1, shape: entry.shape,
            orientation: 0 as const, color: entry.color,
          };
          const points = tileToSvgPoints(previewTile);
          return (
            <div key={i} className={styles.item}>
              <svg viewBox="0 0 40 40" width={28} height={28} className={styles.preview}>
                <polygon points={points} fill={entry.color} stroke="#333" strokeWidth={1.5} />
              </svg>
              <div className={styles.info}>
                <span className={styles.shape}>{SHAPE_LABELS[entry.shape]}</span>
                <span className={styles.size}>{entry.size}&quot;</span>
              </div>
              <span className={styles.count}>x{entry.count}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.total}>Total: {totalPieces} pieces</div>
    </aside>
  );
}
