import TickerCoreInfo from '@/components/tickers/TickerCoreInfo';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const TickerContainerSmall = ({ ticker_data }) => {
    useEffect(() => {
        // here update te chart
    }, [ticker_data]);

    return (
        <div className="rounded bg-darker-600 p-0 text-white">
            <TickerCoreInfo ticker_data={ticker_data}></TickerCoreInfo>
        </div>
    );
};

TickerContainerSmall.propTypes = {
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

export default TickerContainerSmall;
