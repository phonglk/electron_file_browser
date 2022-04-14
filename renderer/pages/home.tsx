import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Mousetrap from 'mousetrap';
import { getPathPerColumn, getRoot } from '../utils/fileUtils';
import Column from '../components/Column';
import {
  DirectoryEntity,
  FileEntity,
  FolderEntity,
  ReadErrorEntity,
  SymlinkEntity,
} from '../utils/DirectoryEntity';
import Path from '../utils/Path';

function Home() {
  const [currentPath, setCurrentPath] = useState<Path>(null);

  const handleColumnNavigate = (entity: DirectoryEntity) => {
    if (entity instanceof FolderEntity) return setCurrentPath(entity.getPath());
    if (entity instanceof SymlinkEntity)
      return handleColumnNavigate(entity.resolvedEntity);
    if (entity instanceof FileEntity) return alert('File will be implemented');
    if (entity instanceof ReadErrorEntity)
      return alert(`This entity has read error: ${entity.error.message}`);
    return alert('Cannot handle navigation: Unknown type');
  };

  useEffect(() => {
    setCurrentPath(new Path(getRoot()));
    Mousetrap.bind('left', () => {
      setCurrentPath((path) => path.upLevel());
    });
  }, []);

  const paths = getPathPerColumn(currentPath);

  return (
    <React.Fragment>
      <Head>
        <title>File Explorer with Electron!</title>
      </Head>
      <div className="flex flex-row h-full">
        {currentPath === null ? (
          'Loading'
        ) : (
          <>
            <Column
              path={paths[0]}
              currentPath={currentPath}
              handleNavigate={handleColumnNavigate}
            />
            <Column
              path={paths[1]}
              currentPath={currentPath}
              handleNavigate={handleColumnNavigate}
            />
            <Column
              path={paths[2]}
              currentPath={currentPath}
              handleNavigate={handleColumnNavigate}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default Home;
