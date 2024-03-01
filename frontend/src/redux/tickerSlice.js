import { createSlice } from '@reduxjs/toolkit';

export const tickerSlice = createSlice({
    name: 'ticker',
    initialState: {
        userTickers: [],
        loading: true,
    },
    reducers: {
        updateTickers: (_state, _action) => {},
        setUserTickers: (state, action) => {
            console.log('Setting user tickers', action.payload);
            state.userTickers = action.payload;
            state.loading = false;
        },
    },
});

export const tickerSliceActions = tickerSlice.actions;

export default tickerSlice.reducer;
