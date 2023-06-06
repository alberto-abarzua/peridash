import { Box } from '@mui/material';

import PropTypes from 'prop-types';

import StockInfo from './StockInfo';

const UserTickers = ({ userTickers, getUserTickers }) => {
    console.log('user tickres here', userTickers);

    return (
        <Box>
            {userTickers &&
                userTickers.map(result => (
                    <StockInfo
                        key={result.id}
                        getUserTickers={getUserTickers}
                        result={result}
                    />
                ))}
        </Box>
    );
};

UserTickers.propTypes = {
    userTickers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            symbol: PropTypes.string,
            exchange: PropTypes.string,
        })
    ).isRequired,
    getUserTickers: PropTypes.func.isRequired,
};

export default UserTickers;
