import fs, { Dirent } from 'fs-extra';
import path from 'path';

/** This probably depends on system, default to '/' for now */
export function getRoot() {
  return '/';
}

export async function readDir(
  paths: string[],
  filters: Array<(dirent: Dirent) => boolean> = []
): Promise<{ ents: Dirent[]; paths: string[] }> {
  const fullPath = path.join(...paths);
  const realPath = await fs.realpath(fullPath);
  const realPaths = ['/'].concat(realPath.split('/').slice(1));

  const dirents = await fs.readdir(fullPath, { withFileTypes: true });
  const filteredEnts = dirents.filter((dirent) =>
    filters.every((f) => f(dirent))
  );

  return { ents: filteredEnts, paths: realPaths };
}

export const filterHiddenFile = (dirent: Dirent) =>
  !dirent.name.startsWith('.');

export const areEqualPaths = (paths1: string[], paths2: string[]) =>
  paths1.join('/') === paths2.join('/');