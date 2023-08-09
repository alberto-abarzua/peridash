import { useState, useEffect } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const TickerStatsInfo = ({ stats }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute top-0 right-10 p-2  bg-transparent rounded-sm text-white flex m-auto w-72">
            <div className="mt-2 self-center flex-shrink mr-10">
                <span className="text-3xl"> {currentTime.toLocaleTimeString()}</span>
                
            </div>
            <div className=" self-center flex-shrink text-3xl">
            <CalendarMonthIcon></CalendarMonthIcon>
                
            </div>
            <div className="self-center flex-shrink text-2xl">
            {stats.num_days}
                
            </div>
        </div>
    );
};

export default TickerStatsInfo;
