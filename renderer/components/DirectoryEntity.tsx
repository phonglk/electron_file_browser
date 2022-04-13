import { Dirent } from 'fs';
import React, { MouseEventHandler, ReactNode } from 'react';
import { FolderIcon, FolderOpenIcon, XIcon } from '@heroicons/react/solid';
import { DocumentIcon } from '@heroicons/react/outline';
import classNames from 'classnames';

const getIcon = (dirent: Dirent, isSelected: boolean): ReactNode => {
  const className = 'inline-block w-4 h-4 mr-1';
  if (dirent.isDirectory()) {
    const folderClassName = classNames(className, 'text-blue-700');
    if (isSelected) return <FolderOpenIcon className={folderClassName} />;
    else return <FolderIcon className={folderClassName} />;
  }
  if (dirent.isFile()) return <DocumentIcon className={className} />;
  return <XIcon className={className} />;
};

export default function DirectoryEntity(props: {
  dirent: Dirent;
  isSelected: boolean;
  isHovering: boolean;
  onClick: MouseEventHandler;
}) {
  const { dirent, isSelected, isHovering, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={classNames('p-1', isSelected ? 'bg-blue-200 rounded-lg' : '')}
    >
      {getIcon(dirent, isSelected)}
      {dirent.name}
    </div>
  );
}
