import _ from 'lodash';
import { findEntityInConfig, log } from './utils';
import {
  FileEntity,
  FolderEntity,
  ReadErrorEntity,
  SymlinkEntity,
} from './utils/DirectoryEntity';
import { Action, ActionType, State } from './utils/reducerUtils';

const reducer = (state: State, action: Action) => {
  const { columnsConfig, hoveringEntity, currentPath } = state;
  log(action.type, action.payload, _.cloneDeep(state));

  try {
    switch (action.type) {
      case ActionType.SET_CURRENT_PATH:
        return { ...state, currentPath: action.payload };
      case ActionType.SET_HOVERING_ENTITY:
        return { ...state, hoveringEntity: action.payload };
      case ActionType.KEYBOARD_UP:
        return {
          ...state,
          hoveringEntity:
            hoveringEntity.getPath().prev?.entity ?? hoveringEntity,
        };
      case ActionType.KEYBOARD_DOWN:
        return {
          ...state,
          hoveringEntity:
            hoveringEntity.getPath().next?.entity ?? hoveringEntity,
        };
      case ActionType.SET_COLUMNS_CONFIG: {
        const columnsConfig = action.payload;
        let { currentPath, hoveringEntity } = state;
        if (!currentPath.entity) {
          currentPath =
            findEntityInConfig(currentPath, columnsConfig)?.getPath() ??
            currentPath;
        }

        if (columnsConfig.length) {
          const firstEntity = _.last(columnsConfig).entities[0];
          hoveringEntity = firstEntity ? firstEntity : currentPath.entity;
        }

        return { ...state, hoveringEntity, currentPath, columnsConfig };
      }
      case ActionType.KEYBOARD_ENTER: {
        if (!hoveringEntity) return state;
        return reducer(state, {
          type: ActionType.NAVIGATE,
          payload: hoveringEntity,
        });
      }
      case ActionType.KEYBOARD_LEFT: {
        // cursor in the last column
        if (
          columnsConfig.length > 1 &&
          _.last(columnsConfig).entities.includes(hoveringEntity)
        ) {
          return { ...state, hoveringEntity: currentPath.entity };
        }

        return {
          ...state,
          currentPath: currentPath.upLevel(),
        };
      }
      case ActionType.NAVIGATE: {
        let { payload: entity } = action;
        if (entity instanceof SymlinkEntity) entity = entity.resolvedEntity;
        if (entity instanceof FolderEntity)
          return {
            ...state,
            currentPath: entity.getPath(),
          };
        if (entity instanceof FileEntity) {
          alert('File will be implemented');
        }
        if (entity instanceof ReadErrorEntity)
          alert(`This entity has read error: ${entity.error.message}`);
      }
      default:
        return state;
    }
  } catch (err) {
    console.log('Error while reducing', err);
    return state;
  }
};

export default reducer;
