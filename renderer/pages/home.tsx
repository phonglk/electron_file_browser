import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Head from 'next/head';
import Mousetrap from 'mousetrap';
import _ from 'lodash';
import {
  getEntitiesFromPath,
  getPathPerColumn,
  getRoot,
} from '../utils/fileUtils';
import Column from '../components/Column';
import {
  DirectoryEntity,
  FileEntity,
  FolderEntity,
  ReadErrorEntity,
  SymlinkEntity,
} from '../utils/DirectoryEntity';
import Path from '../utils/Path';
import BrowsingContext from '../utils/BrowsingContext';

function Home() {
  const [currentPath, setCurrentPath] = useState<Path>(null);
  const [currentHoverItem, setCurrentHoverItem] = useState<Path>(null);
  const [columnsConfig, setColumnsConfig] = useState<
    {
      path: Path;
      entities: DirectoryEntity[];
    }[]
  >([]);
  const hoveringEntity = useRef(null);

  const handleColumnNavigate = (entity: DirectoryEntity) => {
    if (entity instanceof FolderEntity) return setCurrentPath(entity.getPath());
    if (entity instanceof SymlinkEntity)
      return handleColumnNavigate(entity.resolvedEntity);
    if (entity instanceof FileEntity) return alert('File will be implemented');
    if (entity instanceof ReadErrorEntity)
      return alert(`This entity has read error: ${entity.error.message}`);
    console.log(entity);
    return alert('Cannot handle navigation: Unknown type');
  };

  // Closure hell
  hoveringEntity.current = currentHoverItem?.entity;

  useEffect(() => {
    setCurrentPath(new Path(getRoot()));

    Mousetrap.bind('left', () => {
      setCurrentPath((path) => path.upLevel());
    });
    Mousetrap.bind('up', () => {
      setCurrentHoverItem((cur) => cur.prev ?? cur);
    });
    Mousetrap.bind('down', () => {
      setCurrentHoverItem((cur) => cur.next ?? cur);
    });
    Mousetrap.bind(['right', 'enter'], () => {
      if (!hoveringEntity.current) return;
      handleColumnNavigate(hoveringEntity.current);
    });
  }, []);

  useEffect(() => {
    const paths = getPathPerColumn(currentPath);
    Promise.all(paths.map(getEntitiesFromPath))
      .then((entitiesPerColumn) => {
        const columnsConfig = entitiesPerColumn.map((entities, i) => ({
          entities,
          path: paths[i],
        }));

        setColumnsConfig(columnsConfig);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, [currentPath]);

  useEffect(() => {
    if (!columnsConfig.length) return;
    setCurrentHoverItem(_.last(columnsConfig).entities[0]?.getPath());
  }, [columnsConfig]);

  const paths = useMemo(() => getPathPerColumn(currentPath), [currentPath]);
  return (
    <React.Fragment>
      <Head>
        <title>File Explorer with Electron!</title>
      </Head>
      <div className="flex flex-row h-full">
        {currentPath === null ? (
          'Loading'
        ) : (
          <BrowsingContext.Provider
            value={{ setCurrentHoverItem, currentHoverItem }}
          >
            {columnsConfig.map(({ path, entities }) => (
              <Column
                key={path.toString()}
                path={path}
                currentPath={currentPath}
                entities={entities}
                handleNavigate={handleColumnNavigate}
              />
            ))}
          </BrowsingContext.Provider>
        )}
      </div>
    </React.Fragment>
  );
}

export default Home;
