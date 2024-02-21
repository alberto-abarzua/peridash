import { createSlice } from '@reduxjs/toolkit';

export const tickerSlice = createSlice({
    name: 'counter',
    initialState: {
        userTickers: [],
        loading: true,
     
    },
    reducers: {
        updateTickers: (_state, _action) => {
            console.log('update tickres action called! <---');
            // used to trigger the saga to update the tickers
        },
        setUserTickers: (state, action) => {
            console.log('setUserTickers', action.payload);
            state.userTickers = action.payload;
            state.loading = false;
        },
    },
});

export const tickerSliceActions = tickerSlice.actions;

export default tickerSlice.reducer;
