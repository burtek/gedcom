import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { MappedFamily } from './map';


const adapter = createEntityAdapter<MappedFamily>({
    sortComparer({ id: apid1 }, { id: apid2 }) {
        return apid1.localeCompare(apid2, 'en', { numeric: true });
    }
});

export const { actions, name, reducer } = createSlice({
    name: 'families',
    initialState: adapter.getInitialState(),
    reducers: create => ({
        load: create.preparedReducer(
            (data: MappedFamily[]) => ({ payload: data }),
            (state, { payload }) => {
                adapter.upsertMany(state, payload);
            }
        ),
        reset: create.reducer(() => adapter.getInitialState())
    })
});

const getState = (state: { [name]: ReturnType<typeof reducer> }) => state[name];
export const getFamilies = adapter.getSelectors(getState).selectAll;
