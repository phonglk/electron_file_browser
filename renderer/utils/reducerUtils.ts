import _ from 'lodash';
import { createContext, Dispatch } from 'react';
import { DirectoryEntity } from './DirectoryEntity';
import Path from './Path';

export type State = {
  currentPath: Path;
  hoveringEntity: DirectoryEntity;
  columnsConfig: { path: Path; entities: DirectoryEntity[] }[];
};

export enum ActionType {
  SET_CURRENT_PATH = 'SET_CURRENT_PATH',
  SET_HOVERING_ENTITY = 'SET_HOVERING_ENTITY',
  SET_COLUMNS_CONFIG = 'SET_COLUMNS_CONFIG',
  NAVIGATE = 'NAVIGATE',
  KEYBOARD_LEFT = 'KEYBOARD_LEFT',
  KEYBOARD_ENTER = 'KEYBOARD_ENTER',
  KEYBOARD_DOWN = 'KEYBOARD_DOWN',
  KEYBOARD_UP = 'KEYBOARD_UP',
}

export type Action =
  | { type: ActionType.SET_CURRENT_PATH; payload: Path }
  | { type: ActionType.SET_HOVERING_ENTITY; payload: DirectoryEntity }
  | { type: ActionType.SET_COLUMNS_CONFIG; payload: State['columnsConfig'] }
  | { type: ActionType.NAVIGATE; payload: DirectoryEntity }
  | { type: ActionType; payload?: null };

export const StateContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({ state: null, dispatch: _.noop });
