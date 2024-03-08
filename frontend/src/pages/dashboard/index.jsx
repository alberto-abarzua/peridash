
import TickerContainerBig from '@/components/tickers/TickerContainerBig';
import TickerContainerSmall from '@/components/tickers/TickerContainerSmall';
import TickerStatsInfo from '@/components/tickers/TickerStatsInfo';
import { useSelector } from 'react-redux';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const Dashboard = () => {
    let {
        userTickers: tickerData,
        userSettings: { carousel_time },
    } = useSelector(state => state.ticker);

    let big_tickers = tickerData.filter(ticker => ticker.ticker.show_graph);
    let small_tickers = tickerData.filter(ticker => !ticker.ticker.show_graph);
    let big_tickers_favorite = big_tickers.filter(ticker => ticker.ticker.is_favorite);
    let small_tickers_favorite = small_tickers.filter(ticker => ticker.ticker.is_favorite);

    big_tickers = big_tickers.filter(ticker => !ticker.ticker.is_favorite);
    small_tickers = small_tickers.filter(ticker => !ticker.ticker.is_favorite);

    const chunkArray = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );

    const big_ticker_slides = chunkArray(big_tickers, 4);
    const small_ticker_slides = chunkArray(small_tickers, 12);
    const big_tickers_favorite_slides = chunkArray(big_tickers_favorite, 2);
    const small_tickers_favorite_slides = chunkArray(small_tickers_favorite, 8);

    return (
        <div className="mt-2 grid grid-cols-12 grid-rows-12 gap-3 px-4">
            <Carousel
                className="col-span-12 row-span-4 lg:col-span-7"
                loop={true}
                plugins={[Autoplay({ playOnInit: true, delay: 1000 * carousel_time })]}
            >
                <CarouselContent>
                    {big_tickers_favorite_slides.map((slide, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-1 gap-2 rounded-md border border-yellow-500/20 lg:grid-cols-2">
                                {slide.map((ticker, index) => (
                                    <TickerContainerBig key={index} ticker_data={ticker} />
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Carousel
                className="col-span-12 row-span-4 lg:col-span-5"
                loop={true}
                plugins={[Autoplay({ playOnInit: true, delay: 1000 * carousel_time })]}
            >
                <CarouselContent>
                    {small_tickers_favorite_slides.map((slide, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-1 gap-2 rounded-md border border-yellow-500/20 lg:grid-cols-2">
                                {slide.map((ticker, index) => (
                                    <TickerContainerSmall key={index} ticker_data={ticker} />
                                ))}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Carousel
                className="col-span-12 row-span-8 lg:col-span-7"
                loop={true}
                plugins={[Autoplay({ playOnInit: true, delay: 1000 * carousel_time })]}
            >
                <CarouselContent>
                    {big_ticker_slides.map((slide, slideIndex) => (
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

            <Carousel
                className="col-span-12 row-span-8 lg:col-span-5"
                loop={true}
                plugins={[Autoplay({ playOnInit: true, delay: 1000 * carousel_time })]}
            >
                <CarouselContent>
                    {small_ticker_slides.map((slide, slideIndex) => (
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

            <TickerStatsInfo />
        </div>
    );
};

export default Dashboard;
