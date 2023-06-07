import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import api from '@/utils/api';
import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';

import { useEffect, useState } from 'react';
const DashPage = () => {
    const [timeSeries, setTimeSeries] = useState([]);

    useEffect(() => {
        const get_tickers = async () => {
            let response = await api.get(
                '/ticker/time_series/?symbols=__ALL_USER__'
            );
            if (response.status === 200) {
                setTimeSeries(response.data);
            } else {
                alert('Error fetching time series');
            }
        };
        get_tickers();
    }, [setTimeSeries]);

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={3}>
                    {timeSeries.map((ticker, index) => (
                        <TickerContainerBig key={index} ticker_data={ticker} />
                    ))}
                </Grid>

                <Grid item xs={12} sm={12} md={3}>
                    <h1>hola</h1>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <h1>hola</h1>
                </Grid>
            </Grid>
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
