import { createSelector, createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const { actions, name, reducer: rawReducer } = createSlice({
    name: 'config',
    initialState: { showUtils: true },
    reducers: create => ({
        toggleShowUtils: create.reducer(
            state => {
                state.showUtils = !state.showUtils;
            }
        )
    })
});

const getState = (state: { [name]: ReturnType<typeof rawReducer> }) => state[name];
export const getShowUtils = createSelector(getState, state => state.showUtils);

const reducer = persistReducer(
    {
        key: 'gedcom:config',
        storage
    },
    rawReducer
);

export { actions, reducer };
