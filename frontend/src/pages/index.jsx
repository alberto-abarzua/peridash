import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import api from '@/utils/api';
import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';

import { useEffect, useState } from 'react';
const DashPage = () => {
    const [tickerData, setTickerData] = useState([]);

    useEffect(() => {
        const get_time_series = async () => {
            let response = await api.get(
                '/ticker/time_series/?symbols=__ALL_USER__&days=7'
            );
            if (response.status === 200) {
                console.log(response.data);

                setTickerData(response.data);
            } else {
                alert('Error fetching time series');
            }
        };

        get_time_series();
    }, [setTickerData]);
    console.log(tickerData);
    let favorite_tickers = tickerData.filter(
        ticker => ticker.ticker.is_favorite
    );
    let not_favorite_tickers = tickerData.filter(
        ticker => !ticker.ticker.is_favorite
    );
    console.log(favorite_tickers);
    console.log(not_favorite_tickers);
    //Divide not_favorite_tickers into 3 arrays of equal size
    let not_favorite_tickers_1 = not_favorite_tickers.slice(
        0,
        Math.ceil(not_favorite_tickers.length / 2)
    );
    let not_favorite_tickers_2 = not_favorite_tickers.slice(
        Math.ceil(not_favorite_tickers.length / 2),
        not_favorite_tickers.length
    );

    //split favorite in 2 arrays
    let favorite_tickers_1 = favorite_tickers.slice(
        0,
        Math.ceil(favorite_tickers.length / 2)
    );
    let favorite_tickers_2 = favorite_tickers.slice(
        Math.ceil(favorite_tickers.length / 2),
        favorite_tickers.length
    );

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={14} sm={12} md={3}>
                    {favorite_tickers_1.map((ticker, index) => (
                        <TickerContainerBig key={index} ticker_data={ticker} />
                    ))}
                </Grid>

                <Grid item xs={12} sm={12} md={3}>
                    {favorite_tickers_2.map((ticker, index) => (
                        <TickerContainerBig key={index} ticker_data={ticker} />
                    ))}
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    {not_favorite_tickers_1.map((ticker, index) => (
                        <TickerContainerSmall
                            key={index}
                            ticker_data={ticker}
                        />
                    ))}
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    {not_favorite_tickers_2.map((ticker, index) => (
                        <TickerContainerSmall
                            key={index}
                            ticker_data={ticker}
                        />
                    ))}
                </Grid>
            </Grid>
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
