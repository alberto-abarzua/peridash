import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import styles from './TickerContainerBig.module.css';

Chart.register(...registerables);

const TickerContainerBig = props => {
    useEffect(() => {}, [props]);
    let data = props.ticker_data;

    let currentPrice = data.cur_price;
    let priceVariation = data.price_dif;
    let percentageVariation = data.price_dif_percent;
    useEffect(() => {}, [props]);
    // let df = data.df; // django df
    const options = {
        scales: {
            y: {
                display: false,

                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'white',
                },
            },
            x: {
                display: false,

                grid: {
                    display: false,
                },
                ticks: {
                    color: 'white',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'white',
                },
            },
        },
    };

    return (
        <Box width={1 / 2} p={2}>
            <Card className={styles.container}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="div">
                                Stock Name
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="div">
                                Current Price: {currentPrice}
                            </Typography>
                            <Typography variant="body2">
                                {priceVariation}
                            </Typography>
                            <Typography>
                                Percentage Variation: {percentageVariation}%
                            </Typography>
                        </Grid>
                    </Grid>

                    <Line data={data} options={options} />
                </CardContent>
            </Card>
        </Box>
    );
};

TickerContainerBig.propTypes = {
    ticker_data: PropTypes.shape({
        cur_price: PropTypes.number.isRequired,
        price_dif: PropTypes.number.isRequired,
        price_dif_percent: PropTypes.number.isRequired,
        df: PropTypes.object.isRequired,
    }),
};

export default TickerContainerBig;
