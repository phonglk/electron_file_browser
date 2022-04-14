import { Dirent } from 'fs';
import React, { useEffect, useState } from 'react';
import { DirectoryEntity, FolderEntity } from '../utils/DirectoryEntity';
import { filterHiddenEntities, sortByFileEntity } from '../utils/fileUtils';
import Path from '../utils/Path';
import DirectoryEntityRenderer from './DirectoryEntityRenderer';

export default function Column(props: {
  path: Path;
  currentPath: Path;
  handleNavigate: (entity: DirectoryEntity) => void;
}) {
  const { path, handleNavigate, currentPath } = props;
  const [currentEntities, setCurrentEntities] = useState<DirectoryEntity[]>([]);

  useEffect(() => {
    if (!path) {
      setCurrentEntities([]);
      return;
    }
    DirectoryEntity.read(path)
      .then((entity) => {
        if (!(entity instanceof FolderEntity)) {
          alert('Not support this type of enity');
          return;
        }

        return entity
          .getEntities([filterHiddenEntities, sortByFileEntity])
          .then((entities) => {
            setCurrentEntities(entities);
          });
      })
      .catch((error) => {
        alert(`Error while reading "${path}": ${error.message}`);
      });
  }, [path]);

  return (
    <div className="flex flex-col flex-1 h-full p-2 overflow-auto">
      {currentEntities.map((entity) => (
        <DirectoryEntityRenderer
          key={entity.getPath().toString()}
          entity={entity}
          onClick={handleNavigate.bind(null, entity)}
          isSelected={currentPath.includesPath(entity.getPath())}
          isHovering={false}
        />
      ))}
    </div>
  );
}
