/* eslint-disable no-restricted-imports */
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';


import { reducer as config } from './config/slice';
import { reducer as families } from './family/slice';
import { reducer as persons } from './person/slice';
import { reducer as sources } from './source/slice';


export const store = configureStore({
    reducer: {
        config,
        families,
        persons,
        sources
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } })
});
export const persistor = persistStore(
    store
);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
