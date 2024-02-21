import SegmentIcon from '@mui/icons-material/Segment';

import PropTypes from 'prop-types';

import UserTicker from './UserTicker';
import {useSelector} from 'react-redux';

const UserTickers = () => {
    const userTickers = useSelector(state => state.ticker.userTickers);
    console.log(userTickers);

    return (
        <div className="w-full sm:w-1/2">
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
                            result={result}
                        />
                    ))}
            </div>
        </div>
    );
};

export default UserTickers;
