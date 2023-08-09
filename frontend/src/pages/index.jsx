import useNotification from '@/components/general/notification/useNotification';
import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import TickerStatsInfo from '@/components/tickers/TickerStatsInfo';
import api from '@/utils/api';
import { withAuth } from '@/utils/auth';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const DashPage = () => {
    const [tickerData, setTickerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showNotification, renderNotification } = useNotification();
    const NUM_DAYS = 7;
    useEffect(() => {
        console.log('THIS WAS CALLED');
        setLoading(true);
        const get_time_series = async () => {
            let response = await api.get(
                '/ticker/time_series/?symbols=__ALL_USER__&days=' + NUM_DAYS
            );
            if (response.status === 200) {
                setLoading(false);

                setTickerData(response.data);
            } else {
                showNotification(
                    'Failed to get Ticker Data!',
                    <ReportProblemIcon className=" text-red-500" />,
                    'bg-red-100'
                );

                setLoading(false);
            }
        };

        // call it immediately
        get_time_series();

        // setup the interval
        const interval = setInterval(() => {
            get_time_series();
        }, 30000); // fetches every 30 seconds

        // return a cleanup function to clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [setTickerData, showNotification]);

    let favorite_tickers = tickerData.filter(ticker => ticker.ticker.is_favorite);
    let not_favorite_tickers = tickerData.filter(ticker => !ticker.ticker.is_favorite);
    //Divide not_favorite_tickers into 3 arrays of equal size
    let not_favorite_tickers_1 = not_favorite_tickers.slice(
        0,
        Math.ceil(not_favorite_tickers.length / 2)
    );
    let not_favorite_tickers_2 = not_favorite_tickers.slice(
        Math.ceil(not_favorite_tickers.length / 2),
        not_favorite_tickers.length
    );

    //split favorite in 2 arrays
    let favorite_tickers_1 = favorite_tickers.slice(0, Math.ceil(favorite_tickers.length / 2));
    let favorite_tickers_2 = favorite_tickers.slice(
        Math.ceil(favorite_tickers.length / 2),
        favorite_tickers.length
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4">
                <div className="flex min-h-screen items-center justify-center">
                    <ClipLoader color="rgba(0, 193, 46, 0.8)" size={70} />
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4">
            {renderNotification()}
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <div className="flex flex-1 flex-col space-y-2">
                    {favorite_tickers_1.map((ticker, index) => (
                        <TickerContainerBig key={index} ticker_data={ticker} />
                    ))}
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                    {favorite_tickers_2.map((ticker, index) => (
                        <TickerContainerBig key={index} ticker_data={ticker} />
                    ))}
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                    {not_favorite_tickers_1.map((ticker, index) => (
                        <TickerContainerSmall key={index} ticker_data={ticker} />
                    ))}
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                    {not_favorite_tickers_2.map((ticker, index) => (
                        <TickerContainerSmall key={index} ticker_data={ticker} />
                    ))}
                </div>
            </div>
            <TickerStatsInfo stats={{ num_days: NUM_DAYS }} />
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
