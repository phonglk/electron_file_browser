import _ from 'lodash';
import { DirectoryEntity, FileEntity, FolderEntity } from './DirectoryEntity';
import Path from './Path';
import { State } from './reducerUtils';

/** This probably depends on system, default to '/' for now */
export function getRoot() {
  return process.env.DEFAULT_ROOT ?? '/';
}

export function log(...msgs: any[]) {
  if (!process.env.DEBUG) return;
  console.log(...msgs);
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

export async function getEntitiesFromPath(
  path: Path
): Promise<DirectoryEntity[]> {
  return DirectoryEntity.read(path).then((entity) => {
    if (!(entity instanceof FolderEntity)) {
      alert('Not support this type of entity');
      return [];
    }

    return entity
      .getEntities([filterHiddenEntities, sortByFileEntity])
      .then(linkUpPathInEntities);
  });
}

export async function getColumnsConfig(path: Path) {
  const paths = getPathPerColumn(path);
  const entitiesPerColumn = await Promise.all(paths.map(getEntitiesFromPath));
  const columnsConfig = entitiesPerColumn.map((entities, i) => ({
    entities,
    path: paths[i],
  }));
  return columnsConfig;
}

export const findEntityInConfig = (
  path: Path,
  columnsConfig: State['columnsConfig']
) =>
  _.flatten(columnsConfig.map((config) => config.entities)).find((entity) =>
    entity.getPath().isSame(path)
  );

function linkUpPathInEntities(entities: DirectoryEntity[]) {
  for (let i = 0; i < entities.length; i++) {
    const cur = entities[i].getPath();
    const prev = entities[i - 1]?.getPath();
    const next = entities[i + 1]?.getPath();
    cur.next = next;
    cur.prev = prev;
    cur.entity = entities[i];
  }

  return entities;
}
