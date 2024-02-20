import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import TickerStatsInfo from '@/components/tickers/TickerStatsInfo';
import api from '@/utils/api';
import { SessionContext} from '@/utils/supabase/context';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { useEffect, useState,useContext } from 'react';
import { ClipLoader } from 'react-spinners';

const Dashboard = () => {
    const [tickerData, setTickerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const  {session} = useContext(SessionContext);
    const NUM_DAYS = 7;

    useEffect(() => {
        setLoading(true);
        const get_time_series = async () => {
            console.log(session)
            console.log(session?.access_token);
            let response = await api.get(
                "user_ticker/tickers/"
                ,{
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,

                    },
                }
            );
            if (response.status === 200) {
                setLoading(false);

                setTickerData(response.data);
            } else {

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
        console.log(tickerData)
        return () => clearInterval(interval);
    }, [setTickerData, ]);

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

export default Dashboard;
