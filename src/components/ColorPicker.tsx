import { DEFAULT_PALETTE } from '../constants';
import styles from './ColorPicker.module.css';

interface Props {
  selected: string;
  palette: string[];
  onSelect: (color: string) => void;
  onAddColor: (color: string) => void;
}

export default function ColorPicker({ selected, palette, onSelect, onAddColor }: Props) {
  const allColors = [...new Set([...DEFAULT_PALETTE, ...palette])];

  return (
    <div className={styles.picker}>
      <label className={styles.label}>Color</label>
      <div className={styles.grid}>
        {allColors.map(color => (
          <button
            key={color}
            className={`${styles.swatch} ${selected === color ? styles.active : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelect(color)}
            title={color}
          />
        ))}
      </div>
      <input
        className={styles.custom}
        type="color"
        value={selected}
        onChange={(e) => {
          const c = e.target.value;
          onSelect(c);
          onAddColor(c);
        }}
        title="Custom color"
      />
    </div>
  );
}
