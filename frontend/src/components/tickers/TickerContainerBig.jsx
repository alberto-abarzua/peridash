import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);
Chart.register(annotationPlugin);
const TickerContainerBig = ({ ticker_data }) => {
    const theme = useTheme();

    useEffect(() => {
        // here update te chart
    }, [ticker_data]);

    let currentPrice = ticker_data.cur_price;
    let priceVariation = ticker_data.price_dif;
    let percentageVariation = ticker_data.price_dif_percent;
    priceVariation = priceVariation.toFixed(2);
    percentageVariation = percentageVariation.toFixed(2);
    let main_color =
        priceVariation > 0
            ? theme.palette.stocks.green
            : theme.palette.stocks.red;
    let main_color_light =
        priceVariation > 0
            ? theme.palette.stocks.green_light
            : theme.palette.stocks.red_light;
    let main_color_dark =
        priceVariation > 0
            ? theme.palette.stocks.green_dark
            : theme.palette.stocks.red_dark;

    let iconSx = {
        color: main_color_dark,
        fontSize: '2.1rem',
    };
    let arrowIcon =
        priceVariation > 0 ? (
            <NorthEastIcon sx={iconSx} />
        ) : (
            <SouthEastIcon sx={iconSx} />
        );

    let rawData = Object.entries(ticker_data.df.datetime).map(
        ([, date], index) => ({
            date: new Date(date),
            value: ticker_data.df.close[index],
        })
    );

    // Sort the data by date
    rawData.sort((a, b) => a.date - b.date);

    // Split back into separate arrays for the labels and data
    let date_labels = rawData.map(item => item.date);
    let data = rawData.map(item => item.value);

    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, main_color_light);
    gradient.addColorStop(0.04, main_color_light);
    gradient.addColorStop(0.9, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const chartData = {
        labels: date_labels,
        datasets: [
            {
                label: 'Close Prices',
                data: data,
                fill: 'origin',
                backgroundColor: gradient,
                borderColor: main_color,
                pointRadius: 0, // This line hides the data points
                borderWidth: 1,
                tension: 1.2,
            },
        ],
    };
    console.log(ticker_data);
    const highValues = Object.values(ticker_data.df.high);
    let minHighValue = Math.min(...highValues);
    minHighValue -= minHighValue * 0.03;
    let maxHighValue = Math.max(...highValues);
    maxHighValue += maxHighValue * 0.03;

    const options = {
        // maintainAspectRatio: false,
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
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: currentPrice,
                        yMax: currentPrice,
                        borderColor: theme.palette.stocks.grey,
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line2: {
                        type: 'line',
                        yMin: ticker_data.ticker.buy,
                        yMax: ticker_data.ticker.buy,
                        borderColor: theme.palette.stocks.yellow,
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line3: {
                        type: 'line',
                        yMin: ticker_data.ticker.gain,
                        yMax: ticker_data.ticker.gain,
                        borderColor: theme.palette.stocks.aqua,
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                    line4: {
                        type: 'line',
                        yMin: ticker_data.ticker.loss,
                        yMax: ticker_data.ticker.loss,
                        borderColor: theme.palette.stocks.purple,
                        borderWidth: 1.2,
                        borderDash: [6, 6],
                    },
                },
            },
        },
    };

    return (
        <Box sx={{ maxHeight: '400px' }}>
            <Card
                sx={{
                    color: 'rgb(255, 255, 255)',
                    backgroundColor: '#191819',
                    border: '1px solid rgba(198, 199, 199, 0.3)',
                }}
            >
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h4" component="div">
                                {ticker_data.ticker.symbol.symbol}
                            </Typography>
                            <Typography variant="h6" component="div">
                                {ticker_data.ticker.symbol.exchange}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'right',
                                alignItems: 'right',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    justifyContent: 'right',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: 'right', mr: 2 }}
                                >
                                    {currentPrice}
                                </Typography>
                                {arrowIcon}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    justifyContent: 'right',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h5" sx={{ mr: 2 }}>
                                        {priceVariation}
                                    </Typography>
                                    <Typography variant="h5" sx={{ mr: 2 }}>
                                        {percentageVariation}%
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                <Line data={chartData} options={options} />
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
        ticker: PropTypes.shape({
            symbol: PropTypes.PropTypes.shape({
                name: PropTypes.string.isRequired,
                symbol: PropTypes.string.isRequired,
                exchange: PropTypes.string.isRequired,
            }),
            is_favorite: PropTypes.bool.isRequired,
            buy: PropTypes.number.isRequired,
            gain: PropTypes.number.isRequired,
            loss: PropTypes.number.isRequired,
        }),
    }),
};

export default TickerContainerBig;
