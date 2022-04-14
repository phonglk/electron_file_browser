import { Dirent } from 'fs';
import React, { useEffect, useState } from 'react';
import { DirectoryEntity, FolderEntity } from '../utils/DirectoryEntity';
import { filterHiddenEntities, sortByFileEntity } from '../utils/fileUtils';
import Path from '../utils/Path';
import DirectoryEntityRenderer from './DirectoryEntityRenderer';

export default function Column(props: {
  path: Path;
  currentPath: Path;
  entities: DirectoryEntity[];
  handleNavigate: (entity: DirectoryEntity) => void;
}) {
  const { path, handleNavigate, currentPath, entities } = props;

  return (
    <div className="flex flex-col flex-1 h-full p-2 overflow-auto border-r-2 border-gray-500">
      {entities.map((entity) => (
        <DirectoryEntityRenderer
          key={entity.getPath().toString()}
          entity={entity}
          onClick={handleNavigate.bind(null, entity)}
          isSelected={currentPath.includesPath(entity.getPath())}
        />
      ))}
      {!entities.length && (
        <div className="w-full font-bold text-center text-blue-900">
          The folder is empty
        </div>
      )}
    </div>
  );
}
