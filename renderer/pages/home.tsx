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
  const ref = useRef(null);

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

  // To workaround closure hell
  ref.current = {
    hoveringEntity: currentHoverItem?.entity,
    currentPath,
    columnsConfig,
  };

  useEffect(() => {
    setCurrentPath(new Path(getRoot()));

    Mousetrap.bind('left', () => {
      // cursor in the third column
      if (
        ref.current.columnsConfig[2].entities.includes(
          ref.current.hoveringEntity
        )
      ) {
        setCurrentHoverItem(ref.current.currentPath);
        return;
      }

      setCurrentPath((path) => path.upLevel());
    });
    Mousetrap.bind('up', () => {
      setCurrentHoverItem((cur) => cur?.prev ?? cur);
    });
    Mousetrap.bind('down', () => {
      setCurrentHoverItem((cur) => cur?.next ?? cur);
    });
    Mousetrap.bind(['right', 'enter'], () => {
      if (!ref.current.hoveringEntity) return;
      handleColumnNavigate(ref.current.hoveringEntity);
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

    // Auto select the first item in selected folder, if the folder is empty
    // then fallback to current selection
    const firstEntity = _.last(columnsConfig).entities[0];
    if (firstEntity) {
      setCurrentHoverItem(firstEntity.getPath());
    } else {
      setCurrentHoverItem(currentPath);
    }

    if (!currentPath.entity) {
      const found = _.flatten(
        columnsConfig.map((config) => config.entities)
      ).find((entity) => entity.getPath().isSame(currentPath));
      found && setCurrentPath(found.getPath());
      if (!found) debugger;
    }
  }, [columnsConfig, currentPath]);

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
