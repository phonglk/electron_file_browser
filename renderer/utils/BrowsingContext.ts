import { createContext } from 'react';
import Path from './Path';

const BrowsingContext = createContext({
  setCurrentHoverItem: (_path: Path) => {},
  currentHoverItem: null as Path,
});

export default BrowsingContext;
