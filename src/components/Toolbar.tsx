import { useAppContext } from '../state/context';
import ShapePalette from './ShapePalette';
import SizeControl from './SizeControl';
import OrientationControl from './OrientationControl';
import ColorPicker from './ColorPicker';
import BlockSizeSelector from './BlockSizeSelector';
import styles from './Toolbar.module.css';

export default function Toolbar() {
  const { project, setProject, toolState, setToolState, dispatchHistory } = useAppContext();

  return (
    <aside className={styles.toolbar}>
      <BlockSizeSelector
        blockSize={project.block.blockSize}
        onChange={(size) => {
          setProject(p => ({
            ...p,
            block: { ...p.block, blockSize: size, tiles: [] },
            updatedAt: new Date().toISOString(),
          }));
          dispatchHistory({ type: 'RESET', payload: [] });
        }}
      />
      <ShapePalette
        selected={toolState.selectedShape}
        onSelect={(shape) => setToolState(s => ({ ...s, selectedShape: shape }))}
      />
      <SizeControl
        size={toolState.selectedSize}
        blockSize={project.block.blockSize}
        onChange={(size) => setToolState(s => ({ ...s, selectedSize: size }))}
      />
      <OrientationControl
        orientation={toolState.selectedOrientation}
        onChange={(o) => setToolState(s => ({ ...s, selectedOrientation: o }))}
      />
      <ColorPicker
        selected={toolState.selectedColor}
        palette={project.palette}
        onSelect={(color) => setToolState(s => ({ ...s, selectedColor: color }))}
        onAddColor={(color) => {
          setProject(p => ({
            ...p,
            palette: p.palette.includes(color) ? p.palette : [...p.palette, color],
          }));
        }}
      />
    </aside>
  );
}
