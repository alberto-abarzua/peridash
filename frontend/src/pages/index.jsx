import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import TickerContainerBig from '@/components/tickers/TickerContainerBig';
const DashPage = () => {
    const [timeSeries, setTimeSeries] = useState([]);

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

    useEffect(() => {
        get_tickers();
        console.log('This is time sires', timeSeries);
    }, []);

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
