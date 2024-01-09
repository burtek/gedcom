import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { MappedPerson } from './map';


const adapter = createEntityAdapter<MappedPerson>({
    sortComparer({ id: apid1 }, { id: apid2 }) {
        return apid1.localeCompare(apid2, 'en', { numeric: true });
    }
});

export const { actions, name, reducer } = createSlice({
    name: 'persons',
    initialState: adapter.getInitialState(),
    reducers: create => ({
        load: create.preparedReducer(
            (data: MappedPerson[]) => ({ payload: data }),
            (state, { payload }) => {
                adapter.upsertMany(state, payload);
            }
        ),
        reset: create.reducer(() => adapter.getInitialState())
    })
});

const getState = (state: { [name]: ReturnType<typeof reducer> }) => state[name];
export const getPersons = adapter.getSelectors(getState).selectAll;
export const getPerson = adapter.getSelectors(getState).selectById;
