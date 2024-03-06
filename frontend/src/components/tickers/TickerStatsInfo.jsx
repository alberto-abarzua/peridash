import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const TickerStatsInfo = () => {
    const [currentTime, setCurrentTime] = useState(null);
    const { plot_range } = useSelector(state => state.ticker.userSettings);
    const lastUpdated = useSelector(state => state.ticker.lastUpdated);

    useEffect(() => {
        setCurrentTime(new Date());

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    if (!currentTime) return null;

    return (
        <div className="absolute right-0 top-0 m-auto hidden w-72 justify-center rounded-lg rounded-bl-full bg-darker-700 p-2 text-white md:flex md:flex-row">
            <div className="mr-10  flex-shrink self-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="self-center text-sm italic text-gray-200 ">
                        {`Last ${new Date(lastUpdated).toLocaleTimeString()}`}
                    </div>
                    <span className="text-2xl "> {currentTime.toLocaleTimeString()}</span>
                </div>
            </div>
            <div className="flex ">
                <div className="flex flex-shrink self-center pr-2 text-xl">
                    <CalendarTodayIcon></CalendarTodayIcon>
                </div>
                <div className="flex-shrink self-center text-2xl">{plot_range}</div>
            </div>
        </div>
    );
};

export default TickerStatsInfo;
