import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';

import PropTypes from 'prop-types';

const TickerCoreInfo = ({ ticker_data }) => {
    const { values: time_series, meta } = ticker_data.symbol.price_data;

    console.log('Rendering TickerCoreInfo', ticker_data);

    let currentPrice = parseFloat(time_series[0].close);
    let eodPrice = parseFloat(ticker_data.symbol.eod_data.close);
    let priceVariation = currentPrice - eodPrice;
    let percentageVariation = (priceVariation / eodPrice) * 100;
    let isPositive = priceVariation > 0;
    currentPrice = currentPrice.toFixed(2);
    priceVariation = priceVariation.toFixed(2);
    percentageVariation = percentageVariation.toFixed(2);

    let arrowIcon = isPositive ? (
        <NorthEastIcon className="text-2xl text-green-400" />
    ) : (
        <SouthEastIcon className="text-2xl text-red-400" />
    );
    let formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: meta.currency || "USD",
    }).format(currentPrice);

    let formattedPriceVariation = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: meta.currency || "USD",
    }).format(priceVariation);

    return (
        <div className="h-18 flex items-center justify-between p-2">
            <div>
                <h4 className="text-lg font-bold">{ticker_data.symbol.symbol}</h4>
                <h6 className="text-xs italic">{ticker_data.symbol.exchange}</h6>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end">
                    <h4 className="mr-2 text-lg">{percentageVariation}%</h4>
                    {arrowIcon}
                </div>
                <div className="flex items-center justify-end">
                    <h5 className="text-md mr-4">{formattedPriceVariation}</h5>
                    <h5 className="text-md mr-2">{formattedPrice}</h5>
                </div>
            </div>
        </div>
    );
};

export default TickerCoreInfo;
