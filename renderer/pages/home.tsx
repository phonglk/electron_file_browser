import React, { useEffect, useReducer } from 'react';
import Head from 'next/head';
import Mousetrap from 'mousetrap';
import _ from 'lodash';
import { getColumnsConfig, getRoot } from '../utils';
import Column from '../components/Column';
import Path from '../utils/Path';
import { ActionType, State, StateContext } from '../utils/reducerUtils';
import reducer from '../reducer';

const defaultState: State = {
  currentPath: null,
  hoveringEntity: null,
  columnsConfig: [],
};

function Home() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { currentPath, columnsConfig } = state;

  useEffect(() => {
    dispatch({
      type: ActionType.SET_CURRENT_PATH,
      payload: new Path(getRoot()),
    });

    Mousetrap.bind('left', () => dispatch({ type: ActionType.KEYBOARD_LEFT }));
    Mousetrap.bind('up', () => dispatch({ type: ActionType.KEYBOARD_UP }));
    Mousetrap.bind('down', () => dispatch({ type: ActionType.KEYBOARD_DOWN }));
    Mousetrap.bind(['right', 'enter'], () =>
      dispatch({ type: ActionType.KEYBOARD_ENTER })
    );
  }, []);

  useEffect(() => {
    getColumnsConfig(currentPath)
      .then((columnsConfig) =>
        dispatch({
          type: ActionType.SET_COLUMNS_CONFIG,
          payload: columnsConfig,
        })
      )
      .catch((error) => {
        alert(error.message);
      });
  }, [currentPath]);

  return (
    <React.Fragment>
      <Head>
        <title>File Explorer with Electron!</title>
      </Head>
      <div className="flex flex-row h-full">
        {currentPath === null ? (
          'Loading'
        ) : (
          <StateContext.Provider value={{ state, dispatch }}>
            {columnsConfig.map(({ path, entities }) => (
              <Column key={path.toString()} path={path} entities={entities} />
            ))}
          </StateContext.Provider>
        )}
      </div>
    </React.Fragment>
  );
}

export default Home;
