/* eslint-disable no-restricted-imports, import/default */
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import ParserWorker from '../worker/parser?sharedworker';

import { reducer as config } from './config/slice';
import { reducer as families, name as familiesName } from './data/family';
import { reducer as locations, name as locationsName } from './data/location';
import { reducer as persons, name as personsName } from './data/person';
import { reducer as sources, name as sourcesName } from './data/source';
import { workerMiddleware } from './workers-middleware';


export const store = configureStore({
    reducer: {
        config,
        [familiesName]: families,
        [locationsName]: locations,
        [personsName]: persons,
        [sourcesName]: sources
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
            .concat(workerMiddleware({ parser: new ParserWorker() }))
});
export const persistor = persistStore(
    store
);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
