import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import TickerStatsInfo from '@/components/tickers/TickerStatsInfo';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    let tickerData = useSelector(state => state.ticker.userTickers);

    tickerData = tickerData.filter(
        ticker => ticker.symbol.price_data !== null && ticker.symbol.eod_data !== null
    );

    let favorite_tickers = tickerData.filter(ticker => ticker.ticker.is_favorite);

    let not_favorite_tickers = tickerData.filter(ticker => !ticker.ticker.is_favorite);

    let not_favorite_tickers_1 = not_favorite_tickers.slice(
        0,
        Math.ceil(not_favorite_tickers.length / 2)
    );
    let not_favorite_tickers_2 = not_favorite_tickers.slice(
        Math.ceil(not_favorite_tickers.length / 2),
        not_favorite_tickers.length
    );

    let favorite_tickers_1 = favorite_tickers.slice(0, Math.ceil(favorite_tickers.length / 2));
    let favorite_tickers_2 = favorite_tickers.slice(
        Math.ceil(favorite_tickers.length / 2),
        favorite_tickers.length
    );

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
            <TickerStatsInfo stats={{ num_days: 7 }} />
        </div>
    );
};

export default Dashboard;
