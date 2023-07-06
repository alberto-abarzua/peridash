import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const TickerContainerSmall = ({ ticker_data }) => {
    const theme = useTheme();

    useEffect(() => {
        // here update te chart
    }, [ticker_data]);

    let currentPrice = ticker_data.cur_price;
    let priceVariation = ticker_data.price_dif;
    let percentageVariation = ticker_data.price_dif_percent;
    currentPrice = currentPrice.toFixed(2);
    priceVariation = priceVariation.toFixed(2);
    percentageVariation = percentageVariation.toFixed(2);
    let main_color =
        priceVariation > 0
            ? theme.palette.stocks.green
            : theme.palette.stocks.red;

    let main_color_dark =
        priceVariation > 0
            ? theme.palette.stocks.green_dark
            : theme.palette.stocks.red_dark;

    let iconSx = {
        color: main_color_dark,
        fontSize: '3rem',
        verticalAlign: 'middle',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginLeft: -1,
        //vertical align
    };
    let arrowIcon =
        priceVariation > 0 ? (
            <NorthEastIcon sx={iconSx} />
        ) : (
            <SouthEastIcon sx={iconSx} />
        );

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
                        <Grid item xs={4}>
                            <Typography variant="h4" component="div">
                                {ticker_data.ticker.symbol.symbol}
                            </Typography>
                            <Typography variant="h6" component="div">
                                {ticker_data.ticker.symbol.exchange}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={7}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'right',
                                alignItems: 'right',
                                margin: 0,
                                padding: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    justifyContent: 'right',
                                    margin: 0,
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        textAlign: 'right',
                                        fontSize: '1.5rem',
                                        mr: 2,
                                    }}
                                >
                                    {currentPrice}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    justifyContent: 'right',
                                    margin: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'right',
                                        margin: 0,
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
                        <Grid
                            item
                            xs={1}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end', // Align horizontally to the end (right for LTR layouts)
                                alignItems: 'center', // Align vertically in the center
                                margin: 0,
                            }}
                        >
                            {arrowIcon}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

TickerContainerSmall.propTypes = {
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

export default TickerContainerSmall;
