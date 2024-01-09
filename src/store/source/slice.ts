import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { MappedSource } from './map';


const adapter = createEntityAdapter<MappedSource>({
    sortComparer({ id: apid1 }, { id: apid2 }) {
        return apid1.localeCompare(apid2, 'en', { numeric: true });
    }
});

export const { actions, name, reducer } = createSlice({
    name: 'sources',
    initialState: adapter.getInitialState(),
    reducers: create => ({
        load: create.preparedReducer(
            (data: MappedSource[]) => ({ payload: data }),
            (state, { payload }) => {
                adapter.upsertMany(state, payload);
            }
        ),
        reset: create.reducer(() => adapter.getInitialState())
    })
});

const getState = (state: { [name]: ReturnType<typeof reducer> }) => state[name];
export const getSources = adapter.getSelectors(getState).selectEntities;
export const getSource = adapter.getSelectors(getState).selectById;
