import { createContext, useContext } from 'react';
import type { Tile, TileShape, Orientation, Project } from '../types';
import type { HistoryState } from './history';

export interface ToolState {
  selectedShape: TileShape;
  selectedSize: number;
  selectedOrientation: Orientation;
  selectedColor: string;
  selectedTileId: string | null;
}

export interface AppContextValue {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  tilesHistory: HistoryState<Tile[]>;
  toolState: ToolState;
  setToolState: React.Dispatch<React.SetStateAction<ToolState>>;
  placeTile: (col: number, row: number) => void;
  removeTile: (tileId: string) => void;
  updateTile: (tileId: string, updates: Partial<Tile>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  dispatchHistory: React.Dispatch<import('./history').HistoryAction<Tile[]>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
