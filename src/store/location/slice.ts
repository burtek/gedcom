import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { MappedLocation } from './map';


const adapter = createEntityAdapter<MappedLocation>({
    sortComparer({ id: apid1 }, { id: apid2 }) {
        return apid1.localeCompare(apid2, 'en', { numeric: true });
    }
});

export const { actions, name, reducer } = createSlice({
    name: 'locations',
    initialState: adapter.getInitialState(),
    reducers: create => ({
        load: create.preparedReducer(
            (data: MappedLocation[]) => ({ payload: data }),
            (state, { payload }) => {
                adapter.upsertMany(state, payload);
            }
        ),
        reset: create.reducer(() => adapter.getInitialState())
    })
});

const getState = (state: { [name]: ReturnType<typeof reducer> }) => state[name];
export const getLocations = adapter.getSelectors(getState).selectAll;
