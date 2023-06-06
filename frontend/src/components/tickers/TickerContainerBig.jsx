import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import styles from './TickerContainerBig.module.css';

Chart.register(...registerables);

const TickerContainerBig = ({ ticker_data }) => {
    useEffect(() => {
        console.log(ticker_data);
    }, [ticker_data]);

    let currentPrice = ticker_data.cur_price;
    let priceVariation = ticker_data.price_dif;
    let main_color = priceVariation > 0 ? 'green' : 'red';
    let percentageVariation = ticker_data.price_dif_percent;
    // Convert to array of {date, value} objects, so we can sort by date
    // Convert to array of {date, value} objects, so we can sort by date
    let rawData = Object.entries(ticker_data.df.datetime).map(
        ([date, _], index) => ({
            date: new Date(date),
            value: ticker_data.df.close[index],
        })
    );

    // Sort the data by date
    rawData.sort((a, b) => a.date - b.date);

    // Split back into separate arrays for the labels and data
    let date_labels = rawData.map(item => item.date);
    let data = rawData.map(item => item.value);

    const chartData = {
        labels: date_labels,
        datasets: [
            {
                label: 'Close Prices',
                data: data,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: main_color,
                pointRadius: 0, // This line hides the data points
            },
        ],
    };

    const highValues = Object.values(ticker_data.df.high);
    let minHighValue = Math.min(...highValues);
    minHighValue -= minHighValue*0.05;
    let maxHighValue = Math.max(...highValues);
    maxHighValue += maxHighValue*0.05;

    const options = {
        scales: {
            y: {
                min: minHighValue,
                max: maxHighValue,
                display: false,
                beginAtZero: false,
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
                    <Grid item xs={6}>
                        <Typography variant="h5" component="div">
                            {ticker_data.symbol.name}
                        </Typography>
                    </Grid>
                    <Grid container spacing={2}>
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

                    <Line data={chartData} options={options} />
                </CardContent>
            </Card>
        </Box>
    );
};

// TickerContainerBig.propTypes = {
//     ticker_data: PropTypes.shape({
//         cur_price: PropTypes.number.isRequired,
//         price_dif: PropTypes.number.isRequired,
//         price_dif_percent: PropTypes.number.isRequired,
//         df: PropTypes.object.isRequired,
//     }),
// };

export default TickerContainerBig;
