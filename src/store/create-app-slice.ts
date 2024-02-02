import type { Action, PayloadAction } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { NestedData } from '../types/nested-data';


const isWorkerParsedEvent = (action: Action): action is PayloadAction<Partial<Record<string, NestedData[]>>> =>
    action.type === 'worker:parser/parsed';

export const createAppSlice = <T extends { id: string; uid: string }, SN extends string>(
    name: SN,
    gedcomType: string,
    map: (items: NestedData) => T
) => {
    const adapter = createEntityAdapter<T>({
        sortComparer({ id: apid1 }, { id: apid2 }) {
            return apid1.localeCompare(apid2, 'en', { numeric: true });
        }
    });

    const { actions, reducer } = createSlice({
        name,
        initialState: adapter.getInitialState(),
        reducers: create => ({
            load: create.preparedReducer(
                (data: T[]) => ({ payload: data }),
                (state, { payload }) => {
                    adapter.upsertMany(state, payload);
                }
            ),
            reset: create.reducer(() => adapter.getInitialState())
        }),
        extraReducers(builder) {
            builder.addMatcher(isWorkerParsedEvent, (state, { payload }) => {
                const items = payload[gedcomType];
                if (items) {
                    adapter.upsertMany(state, items.map(map));
                }
            });
        }
    });

    const getState = (state: { [N in SN]: ReturnType<typeof reducer> }) => state[name];

    return {
        actions,
        adapter,
        getState,
        name,
        reducer
    };
};
