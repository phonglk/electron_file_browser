import { Dirent } from 'fs';
import React, { useEffect, useState } from 'react';
import { areEqualPaths, filterHiddenFile, readDir } from '../utils/fileUtils';

export default function Column(props: {
  paths: string[];
  handleNavigate: (paths: string[], ent?: Dirent) => void;
}) {
  const { paths, handleNavigate } = props;
  const [currentDirents, setCurrentDirents] = useState([]);

  useEffect(() => {
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

  console.log(currentDirents);

  const handleEntClick = (ent: Dirent) => (event) => {
    const newPaths = paths.concat(ent.name);
    handleNavigate(newPaths, ent);
  };

  return (
    <div className="flex flex-col flex-grow">
      {currentDirents.map((dirent) => (
        <div onClick={handleEntClick(dirent)}>{dirent.name}</div>
      ))}
    </div>
  );
}
