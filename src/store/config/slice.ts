import type { Action, PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createTransform, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { readAndParseData } from '../read-and-parse-data';


const isWorkerErrorEvent = (action: Action): action is PayloadAction<Error | null> =>
    action.type === 'worker:parser/error';

const { actions, name, reducer: rawReducer } = createSlice({
    name: 'config',
    initialState: { error: null as null | string, showUtils: true },
    reducers: create => ({
        toggleShowUtils: create.reducer(
            state => {
                state.showUtils = !state.showUtils;
            }
        )
    }),
    extraReducers(builder) {
        builder
            .addCase(readAndParseData.pending, state => {
                state.error = null;
            })
            .addMatcher(isWorkerErrorEvent, (state, { payload }) => {
                state.error = payload?.message ?? '';
            });
    }
});

const getState = (state: { [name]: ReturnType<typeof rawReducer> }) => state[name];
export const getShowUtils = createSelector(getState, state => state.showUtils);
export const getError = createSelector(getState, state => state.error);

const reducer = persistReducer(
    {
        key: 'gedcom:config',
        transforms: [
            createTransform(
                () => null,
                () => null,
                { whitelist: ['error'] }
            )
        ],
        storage
    },
    rawReducer
);

export { actions, reducer };
