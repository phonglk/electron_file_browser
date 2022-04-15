import React, { MouseEventHandler, ReactNode, useContext } from 'react';
import { FolderIcon, FolderOpenIcon, XIcon } from '@heroicons/react/solid';
import { DocumentIcon, LinkIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import {
  DirectoryEntity,
  FileEntity,
  FolderEntity,
  ReadErrorEntity,
  SymlinkEntity,
} from '../utils/DirectoryEntity';
import { ActionType, StateContext } from '../utils/reducerUtils';

const iconClasses = 'inline-block w-4 h-4 mr-1';

const getIcon = (entity: DirectoryEntity, isSelected: boolean): ReactNode => {
  if (entity instanceof FolderEntity) {
    const folderClassName = classNames(iconClasses, 'text-blue-700');
    if (isSelected) return <FolderOpenIcon className={folderClassName} />;
    else return <FolderIcon className={folderClassName} />;
  }
  if (entity instanceof SymlinkEntity)
    return getIcon(entity.resolvedEntity, isSelected);
  if (entity instanceof FileEntity)
    return <DocumentIcon className={iconClasses} />;
  return <XIcon className={iconClasses} />;
};

export default function DirectoryEntityRenderer(props: {
  entity: DirectoryEntity;
  isSelected: boolean;
  onClick: MouseEventHandler;
}) {
  const { entity, isSelected, onClick } = props;
  const { dispatch, state } = useContext(StateContext);

  let symbolicLink = null;
  if (entity instanceof SymlinkEntity) {
    symbolicLink = <LinkIcon className="inline-block w-4 h-4 ml-1" />;
  }

  const isHovering =
    state.hoveringEntity?.getPath().toString() === entity.getPath().toString();

  const handleMouseOver = () =>
    dispatch({ type: ActionType.SET_HOVERING_ENTITY, payload: entity });

  return (
    <div
      onClick={onClick}
      className={classNames(
        'my-0.5 rounded-lg p-1 flex content-center items-center transition-all',
        {
          'bg-blue-200 ': isSelected,
          'bg-gray-200': isHovering,
          'bg-blue-300': isSelected && isHovering,
          'text-red-600': entity instanceof ReadErrorEntity,
        }
      )}
      onMouseOver={handleMouseOver}
    >
      <div>{getIcon(entity, isSelected)}</div>
      <div>{entity.getName()}</div>
      <div>{symbolicLink}</div>
    </div>
  );
}
