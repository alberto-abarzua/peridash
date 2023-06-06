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
            // if 200
            if (response.status === 200) {
                setTimeSeries(response.data);
                console.log(timeSeries);
            } else {
                alert('Error fetching time series');
            }
        };
        get_tickers();
    }, [timeSeries]);

    return (
        <div>
            {timeSeries.map((ticker, index) => (
                <TickerContainerBig key={index} ticker_data={ticker} />
            ))}

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
            </Grid>
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
