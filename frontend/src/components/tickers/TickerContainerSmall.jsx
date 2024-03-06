import TickerCoreInfo from '@/components/tickers/TickerCoreInfo';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const TickerContainerSmall = ({ ticker_data }) => {
    useEffect(() => {}, [ticker_data]);

    return (
        <div className="rounded bg-darker-600 p-0 text-white">
            <TickerCoreInfo ticker_data={ticker_data}></TickerCoreInfo>
        </div>
    );
};

TickerContainerSmall.propTypes = {
    ticker_data: PropTypes.object,
};

export default TickerContainerSmall;
