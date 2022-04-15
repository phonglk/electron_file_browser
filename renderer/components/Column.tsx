import React, { useContext } from 'react';
import { DirectoryEntity } from '../utils/DirectoryEntity';
import Path from '../utils/Path';
import { ActionType, StateContext } from '../utils/reducerUtils';
import DirectoryEntityRenderer from './DirectoryEntityRenderer';

export default function Column(props: {
  path: Path;
  entities: DirectoryEntity[];
}) {
  const {
    dispatch,
    state: { currentPath },
  } = useContext(StateContext);
  const { entities } = props;

  const handleClick = (entity: DirectoryEntity) =>
    dispatch({
      type: ActionType.NAVIGATE,
      payload: entity,
    });

  return (
    <div className="flex flex-col flex-1 h-full p-2 overflow-auto border-r-2 border-gray-500">
      {entities.map((entity) => (
        <DirectoryEntityRenderer
          key={entity.getPath().toString()}
          entity={entity}
          onClick={handleClick.bind(null, entity)}
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
