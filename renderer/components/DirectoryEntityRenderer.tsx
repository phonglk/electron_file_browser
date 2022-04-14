import { Dirent } from 'fs';
import React, { MouseEventHandler, ReactNode } from 'react';
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
import BrowsingContext from '../utils/BrowsingContext';
import Path from '../utils/Path';

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

  let symbolicLink = null;
  if (entity instanceof SymlinkEntity) {
    symbolicLink = <LinkIcon className="inline-block w-4 h-4 ml-1" />;
  }

  return (
    <BrowsingContext.Consumer>
      {({ setCurrentHoverItem, currentHoverItem }) => {
        const isHovering =
          currentHoverItem?.toString() === entity.getPath().toString();
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
            onMouseOver={() => setCurrentHoverItem(entity.getPath())}
          >
            <div>{getIcon(entity, isSelected)}</div>
            <div>{entity.getName()}</div>
            <div>{symbolicLink}</div>
          </div>
        );
      }}
    </BrowsingContext.Consumer>
  );
}
