import SegmentIcon from '@mui/icons-material/Segment';

import PropTypes from 'prop-types';

import UserTicker from './UserTicker';

const UserTickers = ({ userTickers, getUserTickers }) => {
    return (
        <div className="mx-auto w-full sm:w-1/2">
            <div className="text-3xl text-white">
                <SegmentIcon className="mr-2 text-4xl"></SegmentIcon>
                My Tickers
            </div>
            <br />
            <div className="flex flex-col">
                {userTickers &&
                    userTickers.map(result => (
                        <UserTicker
                            key={result.ticker.id}
                            getUserTickers={getUserTickers}
                            result={result}
                        />
                    ))}
            </div>
        </div>
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
