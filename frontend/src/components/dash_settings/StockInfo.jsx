import {
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    IconButton,
} from '@mui/material';
import api from '@/utils/api';
import PropTypes from 'prop-types';
import GradeIcon from '@mui/icons-material/Grade';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
const StockInfo = ({ result, getUserTickers }) => {
    console.log(result);
    const handleDelete = async () => {
        console.log('Deleting:', result.id);
        let response = await api.delete(`/ticker/user-tickers/${result.id}/`);
        console.log(response.data);
        getUserTickers();
    };

    const handleFavorite = async () => {
        console.log('Favorite:', result.id);
        let response = await api.patch(`/ticker/user-tickers/${result.id}/`, {
            is_favorite: !result.is_favorite,
        });
        console.log(response.data);
        getUserTickers();
    };

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
                <Typography variant="body2" color="text.secondary">
                    Exchange: {result.symbol.exchange}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ID: {result.symbol.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Symbol: {result.symbol.symbol}
                </Typography>
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

// StockInfo.propTypes = {
//     result: PropTypes.shape({
//         id: PropTypes.number,
//         is_favorite: PropTypes.bool,
//         symbol: PropTypes.shape({
//             name: PropTypes.string,
//             exchange: PropTypes.string,
//             id: PropTypes.string,
//             symbol: PropTypes.string,
//         }).isRequired,
//     }).isRequired,
//     setUserTickers: PropTypes.func.isRequired,
// };

export default StockInfo;
