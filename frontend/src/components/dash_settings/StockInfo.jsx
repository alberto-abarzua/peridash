import api from '@/utils/api';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import GradeIcon from '@mui/icons-material/Grade';
import RemoveIcon from '@mui/icons-material/Remove';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    IconButton,
    TextField,
    Box,
    Collapse,
    InputAdornment,
} from '@mui/material';

import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const StockInfo = ({ result, getUserTickers }) => {
    const [favorite, setFavorite] = useState(result.is_favorite);
    const [buy, setBuy] = useState(result.buy);
    const [gain, setGain] = useState(result.gain);
    const [loss, setLoss] = useState(result.loss);
    const isFirstRender = useRef(true);

    const handleDelete = async () => {
        let response = await api.delete(`/ticker/user-tickers/${result.id}/`);
        if (response.status === 204) {
            getUserTickers();
        }
    };

    const handleBuyChange = event => {
        setBuy(event.target.value);
    };

    const handleGainChange = event => {
        setGain(event.target.value);
    };

    const handleLossChange = event => {
        setLoss(event.target.value);
    };

    useEffect(() => {
        const updateTicker = async () => {
            let response = await api.patch(
                `/ticker/user-tickers/${result.id}/`,
                {
                    is_favorite: favorite,
                    buy: buy,
                    gain: gain,
                    loss: loss,
                }
            );
            if (response.status === 200) {
                getUserTickers();
            }
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        updateTicker();
    }, [favorite, buy, gain, loss, getUserTickers, result.id]);

    const handleFavorite = () => {
        setFavorite(!favorite);
    };

    const textFieldSx = {
        mt: 2,
        width: '10rem',
        mr: 1,
    };

    const textFieldsJsx = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
                alignItems: 'right',
            }}
        >
            <TextField
                label="Buy"
                value={buy}
                type="number"
                onChange={handleBuyChange}
                sx={textFieldSx}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <AttachMoneySharpIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                label="Gain"
                value={gain}
                type="number"
                onChange={handleGainChange}
                sx={textFieldSx}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <AddIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                label="Loss"
                value={loss}
                type="number"
                onChange={handleLossChange}
                sx={textFieldSx}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <RemoveIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );

    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography variant="h5" component="div">
                            {result.symbol.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={handleFavorite}>
                            {result.is_favorite ? (
                                <GradeIcon
                                    sx={{ color: 'gold', fontSize: '4rem' }}
                                />
                            ) : (
                                <StarOutlineIcon
                                    sx={{ color: 'grey', fontSize: '4rem' }}
                                />
                            )}
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse in={favorite}>{textFieldsJsx}</Collapse>
                <Button
                    variant="contained"
                    onClick={handleDelete}
                    sx={{
                        mt: 2,
                        backgroundColor: 'error.main',
                        '&:hover': { backgroundColor: 'error.dark' },
                    }}
                >
                    Delete
                </Button>
            </CardContent>
        </Card>
    );
};

StockInfo.propTypes = {
    result: PropTypes.shape({
        id: PropTypes.string,
        is_favorite: PropTypes.bool,
        buy: PropTypes.number,
        gain: PropTypes.number,
        loss: PropTypes.number,
        symbol: PropTypes.shape({
            name: PropTypes.string,
            exchange: PropTypes.string,
            id: PropTypes.string,
            symbol: PropTypes.string,
        }).isRequired,
    }).isRequired,
    getUserTickers: PropTypes.func.isRequired,
};

export default StockInfo;
