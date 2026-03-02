import type { Project } from '../types';

export function saveProjectToFile(project: Project) {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name || 'quilt'}.kwilt.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadProjectFromFile(): Promise<Project> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.kwilt.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { reject(new Error('No file selected')); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as Project;
          if (!data.block || !data.id) {
            reject(new Error('Invalid project file'));
            return;
          }
          resolve(data);
        } catch {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
