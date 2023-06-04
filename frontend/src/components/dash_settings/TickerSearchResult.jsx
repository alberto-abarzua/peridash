import { Card, CardContent, Typography, Grid } from '@mui/material';

import PropTypes from 'prop-types';
const TickerSearchResult = ({ result, onClick }) => {
    const isBasicPlan =
        result.access.plan.toLowerCase() === 'basic' ||
        result.access.plan.toLowerCase() === 'grow';
    let thisOnClick = () => {
        onClick(result.symbol, result.exchange);
    };
    return (
        <Card
            sx={{
                margin: 0,
                width: '100%',
                border: '1px solid black',
                backgroundColor: isBasicPlan
                    ? 'white'
                    : 'rgba(233, 105, 105, 0.8)',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'grey.300',
                },
            }}
            onClick={thisOnClick}
        >
            <CardContent>
                <Typography variant="h6" component="div">
                    {result.symbol} - {result.instrument_name}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6" component="div">
                            Exchange: {result.exchange} ({result.mic_code})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Exchange Timezone: {result.exchange_timezone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Instrument Type: {result.instrument_type}
                        </Typography>
                        <Typography variant="h6" component="div">
                            Currency: {result.currency}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Country: {result.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Access - Global: {result.access.global}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Access - Plan: {result.access.plan}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

TickerSearchResult.propTypes = {
    result: PropTypes.shape({
        symbol: PropTypes.string,
        instrument_name: PropTypes.string,
        exchange: PropTypes.string,
        mic_code: PropTypes.string,
        exchange_timezone: PropTypes.string,
        instrument_type: PropTypes.string,
        country: PropTypes.string,
        currency: PropTypes.string,
        access: PropTypes.shape({
            global: PropTypes.string,
            plan: PropTypes.string,
        }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default TickerSearchResult;
