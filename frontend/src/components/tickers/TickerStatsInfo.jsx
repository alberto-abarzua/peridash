import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
const TickerStatsInfo = ({ stats }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute right-10 top-0 m-auto  flex w-72 rounded-sm bg-transparent p-2 text-white">
            <div className="mr-10 mt-2 flex-shrink self-center">
                <span className="text-3xl"> {currentTime.toLocaleTimeString()}</span>
            </div>
            <div className=" flex-shrink self-center text-3xl">
                <CalendarMonthIcon></CalendarMonthIcon>
            </div>
            <div className="flex-shrink self-center text-2xl">{stats.num_days}</div>
        </div>
    );
};
TickerStatsInfo.propTypes = {
    stats: PropTypes.shape({
        num_days: PropTypes.number.isRequired,
    }),
};

export default TickerStatsInfo;
