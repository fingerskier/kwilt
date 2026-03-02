import { useState, useReducer, useCallback, useEffect } from 'react';
import type { Tile, Project } from './types';
import { AppContext, type ToolState } from './state/context';
import { historyReducer, createHistoryState, type HistoryAction } from './state/history';
import { useAutoSave, loadAutoSave } from './hooks/useAutoSave';
import { saveProjectToFile } from './utils/fileIo';
import { generateId } from './utils/id';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import CutList from './components/CutList';
import styles from './App.module.css';

function createDefaultProject(): Project {
  return {
    id: generateId(),
    name: 'My Quilt Block',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    block: {
      id: generateId(),
      name: 'Block 1',
      blockSize: 12,
      tiles: [],
    },
    palette: [],
  };
}

function tilesReducer(state: ReturnType<typeof createHistoryState<Tile[]>>, action: HistoryAction<Tile[]>) {
  return historyReducer(state, action);
}

export default function App() {
  const [showRestore, setShowRestore] = useState(false);
  const [autoSaveData, setAutoSaveData] = useState<ReturnType<typeof loadAutoSave>>(null);

  const [project, setProject] = useState<Project>(() => {
    const saved = loadAutoSave();
    if (saved) {
      setShowRestore(true);
      setAutoSaveData(saved);
    }
    return createDefaultProject();
  });

  const [tilesHistory, dispatchHistory] = useReducer(tilesReducer, [], (init) => createHistoryState(init));

  const [toolState, setToolState] = useState<ToolState>({
    selectedShape: 'square',
    selectedSize: 2,
    selectedOrientation: 0,
    selectedColor: '#5b8c5a',
    selectedTileId: null,
  });

  // Auto-save
  const projectWithTiles: Project = {
    ...project,
    block: { ...project.block, tiles: tilesHistory.present },
  };
  useAutoSave(projectWithTiles, tilesHistory.present);

  // Restore auto-save
  const handleRestore = useCallback(() => {
    if (autoSaveData) {
      setProject(autoSaveData.project);
      dispatchHistory({ type: 'RESET', payload: autoSaveData.tiles });
    }
    setShowRestore(false);
  }, [autoSaveData]);

  // Tile operations
  const placeTile = useCallback((col: number, row: number) => {
    const newTile: Tile = {
      id: generateId(),
      shape: toolState.selectedShape,
      col,
      row,
      size: toolState.selectedSize,
      orientation: toolState.selectedOrientation,
      color: toolState.selectedColor,
    };
    dispatchHistory({ type: 'SET', payload: [...tilesHistory.present, newTile] });
  }, [toolState, tilesHistory.present]);

  const removeTile = useCallback((tileId: string) => {
    dispatchHistory({ type: 'SET', payload: tilesHistory.present.filter(t => t.id !== tileId) });
  }, [tilesHistory.present]);

  const updateTile = useCallback((tileId: string, updates: Partial<Tile>) => {
    dispatchHistory({
      type: 'SET',
      payload: tilesHistory.present.map(t => t.id === tileId ? { ...t, ...updates } : t),
    });
  }, [tilesHistory.present]);

  const undo = useCallback(() => dispatchHistory({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatchHistory({ type: 'REDO' }), []);
  const canUndo = tilesHistory.past.length > 0;
  const canRedo = tilesHistory.future.length > 0;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatchHistory({ type: 'UNDO' });
      }
      if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatchHistory({ type: 'REDO' });
      }
      if (mod && e.key === 'y') {
        e.preventDefault();
        dispatchHistory({ type: 'REDO' });
      }
      if (mod && e.key === 's') {
        e.preventDefault();
        saveProjectToFile({
          ...project,
          block: { ...project.block, tiles: tilesHistory.present },
          updatedAt: new Date().toISOString(),
        });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, tilesHistory.present]);

  return (
    <AppContext.Provider value={{
      project, setProject,
      tilesHistory, toolState, setToolState,
      placeTile, removeTile, updateTile,
      undo, redo, canUndo, canRedo,
      dispatchHistory,
    }}>
      <div className={styles.app}>
        {showRestore && (
          <div className={styles.restoreBanner}>
            <span>Restore previous session?</span>
            <button onClick={handleRestore}>Restore</button>
            <button onClick={() => setShowRestore(false)}>Dismiss</button>
          </div>
        )}
        <Header />
        <main className={styles.main}>
          <Toolbar />
          <Canvas />
          <CutList />
        </main>
      </div>
    </AppContext.Provider>
  );
}
