import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs-extra';
import { Dirent } from 'fs';
import { filterHiddenFile, getRoot, readDir } from '../utils/fileUtils';
import Column from '../components/Column';

function Home() {
  const [currentPaths, setCurrentPaths] = useState([getRoot()]);

  const handleColumnNavigate = (paths: string[], ent?: Dirent) => {
    console.log(paths, ent, ent?.isDirectory());
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

  return (
    <React.Fragment>
      <Head>
        <title>File Explorer with Electron!</title>
      </Head>
      <div className="flex flex-row">
        <Column paths={currentPaths} handleNavigate={handleColumnNavigate} />
        <div className="flex flex-grow">Col B</div>
        <div className="flex flex-grow">Col C</div>
      </div>
    </React.Fragment>
  );
}

export default Home;
