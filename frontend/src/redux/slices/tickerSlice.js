import { createSlice } from '@reduxjs/toolkit';

export const tickerSlice = createSlice({
    name: 'ticker',
    initialState: {
        userTickers: [],
        loading: true,
        userSettings: { plot_range: 7, carousel_time: 8 },
        lastUpdated: null,
    },
    reducers: {
        //eslint-disable-next-line
        updateTickers: (_state, _action) => {
            // sagas handles this
        },
        setUserTickers: (state, action) => {
            const { tickers, userSettings } = action.payload;
            let tickerData = tickers;
            const { plot_range } = userSettings;
            state.userSettings = userSettings;
            state.loading = false;

            tickerData = tickerData.filter(
                ticker => ticker.symbol.price_data !== null && ticker.symbol.eod_data !== null
            );
            tickerData = tickerData.map(ticker => {
                if (!ticker.symbol.price_data || !ticker.symbol.price_data.values) {
                    return ticker;
                }
                let {
                    price_data: { values },
                } = ticker.symbol;

                // Group values by date
                const groupedValues = values.reduce((acc, value) => {
                    const date = value.datetime.split(' ')[0];
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(value);
                    return acc;
                }, {});

                // Get the dates in descending order
                const dates = Object.keys(groupedValues).sort((a, b) => new Date(b) - new Date(a));

                // Keep only the last plot_range days of data
                const lastDates = dates.slice(0, plot_range);

                // Get the values for the last plot_range days
                const lastValues = lastDates.flatMap(date => groupedValues[date]);

                // Update the ticker object with the modified values
                ticker.symbol.price_data.values = lastValues;

                return ticker;
            });

            state.userTickers = tickerData;
            state.lastUpdated = tickerData[0].symbol.updated_at;
        },
        setUserSettings: (state, action) => {
            state.userSettings = action.payload;
        },
    },
});

export const tickerSliceActions = tickerSlice.actions;

export default tickerSlice.reducer;
