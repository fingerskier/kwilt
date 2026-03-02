import { VALID_EDGE_SIZES } from '../constants';
import styles from './SizeControl.module.css';

interface Props {
  size: number;
  blockSize: number;
  onChange: (size: number) => void;
}

export default function SizeControl({ size, blockSize, onChange }: Props) {
  const validSizes = VALID_EDGE_SIZES.filter(s => s <= blockSize);
  const idx = validSizes.indexOf(size as typeof validSizes[number]);

  const decrement = () => {
    if (idx > 0) onChange(validSizes[idx - 1]!);
  };

  const increment = () => {
    if (idx < validSizes.length - 1) onChange(validSizes[idx + 1]!);
  };

  return (
    <div className={styles.control}>
      <label className={styles.label}>Size</label>
      <div className={styles.row}>
        <button className={styles.btn} onClick={decrement} disabled={idx <= 0}>-</button>
        <span className={styles.value}>{size}&quot;</span>
        <button className={styles.btn} onClick={increment} disabled={idx >= validSizes.length - 1}>+</button>
      </div>
    </div>
  );
}
