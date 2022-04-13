import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Mousetrap from 'mousetrap';
import fs from 'fs-extra';
import { Dirent } from 'fs';
import {
  filterHiddenFile,
  getRoot,
  readDir,
  upLevel,
} from '../utils/fileUtils';
import Column from '../components/Column';

function Home() {
  const [currentPaths, setCurrentPaths] = useState([getRoot()]);

  const handleColumnNavigate = (paths: string[], ent?: Dirent) => {
    if (!ent || ent.isDirectory() || ent.isSymbolicLink()) {
      setCurrentPaths(paths);
      return;
    }
    if (ent.isFile()) {
      alert('Oops! This is a file');
    } else {
      alert('Cannot handle navigation: Unknown type');
    }
  };

  useEffect(() => {
    Mousetrap.bind('left', () => {
      setCurrentPaths((paths) => upLevel(paths));
    });
  }, []);

  const columnPaths = getColumnPaths(currentPaths);
  console.log(...columnPaths);

  return (
    <React.Fragment>
      <Head>
        <title>File Explorer with Electron!</title>
      </Head>
      <div className="flex flex-row">
        <Column paths={columnPaths[0]} handleNavigate={handleColumnNavigate} />
        <Column paths={columnPaths[1]} handleNavigate={handleColumnNavigate} />
        <Column paths={columnPaths[2]} handleNavigate={handleColumnNavigate} />
      </div>
    </React.Fragment>
  );
}

function getColumnPaths(paths: string[]) {
  const columnDatas = [paths.slice(0, -2), paths.slice(0, -1), paths];
  return columnDatas.filter((data) => data.length > 0);
}

export default Home;
