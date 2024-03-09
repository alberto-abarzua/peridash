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
        logout: state => {
            state.session = null;
        },
    },
});

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;
