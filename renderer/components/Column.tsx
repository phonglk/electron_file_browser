import { Dirent } from 'fs';
import React, { useEffect, useState } from 'react';
import {
  areEqualPaths,
  filterHiddenFile,
  getLastLevel,
  readDir,
} from '../utils/fileUtils';
import DirectoryEntity from './DirectoryEntity';

export default function Column(props: {
  paths: string[];
  currentPaths: string[];
  handleNavigate: (paths: string[], ent?: Dirent) => void;
}) {
  const { paths, handleNavigate, currentPaths } = props;
  const [currentDirents, setCurrentDirents] = useState([]);

  useEffect(() => {
    if (!paths) {
      setCurrentDirents([]);
      return;
    }
    readDir(paths, [filterHiddenFile])
      .then(({ ents, paths: resolvedPaths }) => {
        if (!areEqualPaths(paths, resolvedPaths)) {
          return handleNavigate(resolvedPaths);
        }
        setCurrentDirents(ents);
      })
      .catch((e) => {
        alert(e);
      });
  }, [paths]);

  // if (!paths) return null;

  const handleEntClick = (ent: Dirent) => (event) => {
    const newPaths = paths.concat(ent.name);
    handleNavigate(newPaths, ent);
  };

  const lastLevel = getLastLevel(currentPaths);

  return (
    <div className="flex flex-col flex-1 h-full p-2 overflow-auto">
      {currentDirents.map((dirent) => (
        <DirectoryEntity
          key={dirent.name}
          dirent={dirent}
          onClick={handleEntClick(dirent)}
          isSelected={dirent.name === lastLevel}
          isHovering={false}
        />
      ))}
    </div>
  );
}
