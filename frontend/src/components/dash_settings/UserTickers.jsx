import { Box } from '@mui/material';

import PropTypes from 'prop-types';

import StockInfo from './StockInfo';

const UserTickers = ({ userTickers, getUserTickers }) => {
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
            id: PropTypes.string,
            symbol: PropTypes.shape({
                name: PropTypes.string,
                exchange: PropTypes.string,
                id: PropTypes.string,
                symbol: PropTypes.string,
            }).isRequired,
            exchange: PropTypes.string,
        })
    ).isRequired,
    getUserTickers: PropTypes.func.isRequired,
};

export default UserTickers;
