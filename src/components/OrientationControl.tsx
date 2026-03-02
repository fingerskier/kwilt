import type { Orientation } from '../types';
import styles from './OrientationControl.module.css';

interface Props {
  orientation: Orientation;
  onChange: (o: Orientation) => void;
}

export default function OrientationControl({ orientation, onChange }: Props) {
  const rotate = () => {
    onChange(((orientation + 1) % 4) as Orientation);
  };

  return (
    <div className={styles.control}>
      <label className={styles.label}>Rotate</label>
      <button className={styles.btn} onClick={rotate} title="Rotate tile">
        <svg viewBox="0 0 32 32" width={28} height={28}>
          <path
            d="M16 4 A12 12 0 1 1 4 16"
            fill="none" stroke="#333" strokeWidth={2.5} strokeLinecap="round"
          />
          <polygon points="16,1 19,7 13,7" fill="#333" />
        </svg>
        <span className={styles.degree}>{orientation * 90}&deg;</span>
      </button>
    </div>
  );
}
