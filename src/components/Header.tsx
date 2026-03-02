import { useAppContext } from '../state/context';
import { saveProjectToFile, loadProjectFromFile } from '../utils/fileIo';
import styles from './Header.module.css';

export default function Header() {
  const { project, setProject, tilesHistory, undo, redo, canUndo, canRedo, dispatchHistory } = useAppContext();

  const handleSave = () => {
    const fullProject = {
      ...project,
      block: { ...project.block, tiles: tilesHistory.present },
      updatedAt: new Date().toISOString(),
    };
    saveProjectToFile(fullProject);
  };

  const handleLoad = async () => {
    try {
      const loaded = await loadProjectFromFile();
      setProject(loaded);
      dispatchHistory({ type: 'RESET', payload: loaded.block.tiles });
    } catch (err) {
      if (err instanceof Error && err.message !== 'No file selected') {
        alert(`Load failed: ${err.message}`);
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.logo}>kwilt</h1>
        <input
          className={styles.name}
          value={project.name}
          onChange={(e) => setProject(p => ({ ...p, name: e.target.value }))}
          placeholder="Project name"
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          Undo
        </button>
        <button className={styles.btn} onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          Redo
        </button>
        <span className={styles.sep} />
        <button className={styles.btn} onClick={handleSave} title="Save (Ctrl+S)">
          Save
        </button>
        <button className={styles.btn} onClick={handleLoad} title="Load project file">
          Load
        </button>
      </div>
    </header>
  );
}
