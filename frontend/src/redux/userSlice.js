
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        session: null,
    },
    reducers: {
        setUserSession: (state, action) => {
            state.session = action.payload;
        },
        //eslint-disable-next-line
        logout: (state, _action) => {
            state.session = null;
        },
        updateSession: (_state, action) => {
            // sagas handles this
            console.log('updateSession', action);
        },
    },
});

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
