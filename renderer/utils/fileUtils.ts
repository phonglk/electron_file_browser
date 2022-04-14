import fs, { Dirent } from 'fs-extra';
import path from 'path';
import { DirectoryEntity, FileEntity, FolderEntity } from './DirectoryEntity';
import Path from './Path';

/** This probably depends on system, default to '/' for now */
export function getRoot() {
  return process.env.DEFAULT_ROOT ?? '/';
}

export function getPathPerColumn(path: Path, num = 3) {
  if (!path) return [];
  const paths = [path];
  for (let i = 1; i < num; i++) {
    const up = paths[0].upLevel();
    if (up.toString() === paths[0].toString()) continue;
    paths.unshift(up);
  }

  return paths;
}

export const filterHiddenEntities = (entities: DirectoryEntity[]) =>
  entities.filter((entity) => !entity.getName().startsWith('.'));

export const sortByFileEntity = (entities: DirectoryEntity[]) =>
  entities.sort((e1, e2) => {
    if (
      !(e1.resolvedEntity instanceof FileEntity) &&
      e2.resolvedEntity instanceof FileEntity
    )
      return -1;
    if (
      e1.resolvedEntity instanceof FileEntity &&
      !(e2.resolvedEntity instanceof FileEntity)
    )
      return 1;
    return 0;
  });
