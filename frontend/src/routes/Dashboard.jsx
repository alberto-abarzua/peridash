import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import TickerStatsInfo from '@/components/tickers/TickerStatsInfo';
import { useSelector } from 'react-redux';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const Dashboard = () => {
    let tickerData = useSelector(state => state.ticker.userTickers);
    console.log('tickerData', tickerData);
    tickerData = tickerData.filter(
        ticker => ticker.symbol.price_data !== null && ticker.symbol.eod_data !== null
    );
    console.log('tickerData', tickerData);

    let favorite_tickers = tickerData.filter(ticker => ticker.ticker.is_favorite);
    let not_favorite_tickers = tickerData.filter(ticker => !ticker.ticker.is_favorite);

    const chunkArray = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );

    const favorite_tickers_slides = chunkArray(favorite_tickers, 4);
    const not_favorite_tickers_slides = chunkArray(not_favorite_tickers, 12);

    return (
        <div className="grid grid-cols-12">
            <Carousel className="col-span-12 lg:col-span-7" loop={true}>
                <CarouselContent>
                    {favorite_tickers_slides.map((slide, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                                {slide.map((ticker, index) => (
                                    <TickerContainerBig key={index} ticker_data={ticker} />
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Carousel className="col-span-12 lg:col-span-5" loop={true}>
                <CarouselContent>
                    {not_favorite_tickers_slides.map((slide, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                                {slide.map((ticker, index) => (
                                    <TickerContainerSmall key={index} ticker_data={ticker} />
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <TickerStatsInfo
                stats={{ num_days: 7, last_updated: tickerData && tickerData[0].symbol.updated_at }}
            />
        </div>
    );
};

export default Dashboard;
