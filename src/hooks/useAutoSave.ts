import { useEffect } from 'react';
import type { Project, Tile } from '../types';
import { AUTOSAVE_KEY } from '../constants';

export interface AutoSaveData {
  project: Project;
  tiles: Tile[];
  savedAt: string;
}

export function useAutoSave(project: Project, tiles: Tile[]) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const data: AutoSaveData = {
        project,
        tiles,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
      } catch {
        // localStorage full or unavailable — ignore
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [project, tiles]);
}

export function loadAutoSave(): AutoSaveData | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AutoSaveData;
  } catch {
    return null;
  }
}
