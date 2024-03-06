import { useState } from 'react';
import SegmentIcon from '@mui/icons-material/Segment';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import UserTicker from './UserTicker';
import { useSelector } from 'react-redux';
import { Command, CommandInput } from '@/components/ui/command';

const UserTickers = () => {
    const userTickers = useSelector(state => state.ticker.userTickers);
    const [value, setValue] = useState('');

    const filteredTickers = userTickers.filter(result => {
        const name = `${result.symbol.symbol}:${result.symbol.exchange}`;

        return name.toLowerCase().includes(value.toLowerCase());
    });

    return (
        <div className="flex w-full flex-col gap-10 rounded-md border border-gray-500 bg-gray-700 bg-opacity-85 px-2 py-10 shadow-sm shadow-gray-600 lg:px-10">
            <div className="text-3xl text-white">
                <SegmentIcon className="mr-2 text-4xl" />
                My Tickers
            </div>
            <Command className="h-10">
                <CommandInput
                    placeholder="Search ticker..."
                    className="h-9"
                    value={value}
                    onValueChange={setValue}
                />
            </Command>

            <ScrollArea className="flex h-[800px] w-full flex-col items-center justify-center gap-5">
                <div className="flex w-full flex-col items-center justify-center gap-5">
                    {filteredTickers.map(result => (
                        <UserTicker key={result.ticker.id} result={result} />
                    ))}
                </div>
                <ScrollBar />

                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

export default UserTickers;
