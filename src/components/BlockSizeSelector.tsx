import { BLOCK_SIZES } from '../constants';
import styles from './BlockSizeSelector.module.css';

interface Props {
  blockSize: number;
  onChange: (size: number) => void;
}

export default function BlockSizeSelector({ blockSize, onChange }: Props) {
  return (
    <div className={styles.control}>
      <label className={styles.label}>Block Size</label>
      <select
        className={styles.select}
        value={blockSize}
        onChange={(e) => {
          const newSize = Number(e.target.value);
          if (newSize !== blockSize) {
            if (window.confirm('Changing block size will clear current tiles. Continue?')) {
              onChange(newSize);
            }
          }
        }}
      >
        {BLOCK_SIZES.map(s => (
          <option key={s} value={s}>{s}&quot; x {s}&quot;</option>
        ))}
      </select>
    </div>
  );
}
