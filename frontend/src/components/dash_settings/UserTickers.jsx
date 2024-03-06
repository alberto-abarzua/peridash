import SegmentIcon from '@mui/icons-material/Segment';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

import UserTicker from './UserTicker';
import { useSelector } from 'react-redux';

const UserTickers = () => {
    const userTickers = useSelector(state => state.ticker.userTickers);

    return (
        <div className=" flex w-full flex-col gap-10 rounded-md border border-gray-500 bg-gray-700 bg-opacity-85 px-10 py-10 shadow-sm shadow-gray-600">
            <div className="text-3xl text-white">
                <SegmentIcon className="mr-2 text-4xl"></SegmentIcon>
                My Tickers
            </div>

            <ScrollArea className="flex h-[800px] w-full flex-col items-center justify-center gap-5">
                <div className="flex w-full flex-col items-center justify-center gap-5">
                    {userTickers &&
                        userTickers.map(result => (
                            <UserTicker key={result.ticker.id} result={result} />
                        ))}
                </div>
                <ScrollBar />
            </ScrollArea>
        </div>
    );
};

export default UserTickers;
