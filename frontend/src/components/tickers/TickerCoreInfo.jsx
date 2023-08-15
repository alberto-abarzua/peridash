import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';

import PropTypes from 'prop-types';

const TickerCoreInfo = ({ ticker_data }) => {
    let currentPrice = ticker_data.cur_price.toFixed(2);
    let priceVariation = ticker_data.price_dif.toFixed(2);
    let percentageVariation = ticker_data.price_dif_percent.toFixed(2);
    let isPositive = ticker_data.price_dif > 0;

    let arrowIcon = isPositive ? (
        <NorthEastIcon className="text-2xl text-green-400" />
    ) : (
        <SouthEastIcon className="text-2xl text-red-400" />
    );

    return (
        <div className="h-18 flex items-center justify-between p-2">
            <div>
                <h4 className="text-lg">{ticker_data.ticker.symbol.symbol}</h4>
                <h6 className="text-sm">{ticker_data.ticker.symbol.exchange}</h6>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end">
                    <h4 className="mr-2 text-lg">{currentPrice}</h4>
                    {arrowIcon}
                </div>
                <div className="flex items-center justify-end">
                    <h5 className="text-md mr-2">{priceVariation}</h5>
                    <h5 className="text-md mr-2">{percentageVariation}%</h5>
                </div>
            </div>
        </div>
    );
};

TickerCoreInfo.propTypes = {
    ticker_data: PropTypes.shape({
        cur_price: PropTypes.number.isRequired,
        price_dif: PropTypes.number.isRequired,
        price_dif_percent: PropTypes.number.isRequired,
        df: PropTypes.object.isRequired,
        ticker: PropTypes.shape({
            symbol: PropTypes.PropTypes.shape({
                name: PropTypes.string.isRequired,
                symbol: PropTypes.string.isRequired,
                exchange: PropTypes.string.isRequired,
            }),
            is_favorite: PropTypes.bool.isRequired,
            buy: PropTypes.number.isRequired,
            gain: PropTypes.number.isRequired,
            loss: PropTypes.number.isRequired,
        }),
    }),
};
export default TickerCoreInfo;
