import PropTypes from 'prop-types';

const TickerSearchResult = ({ result, onClick }) => {
    const isBasicPlan =
        result.access.plan.toLowerCase() === 'basic' || result.access.plan.toLowerCase() === 'grow';
    let thisOnClick = () => {
        onClick(result.symbol, result.exchange);
    };

    return (
        <div
            className={`rounded-lg border border-black p-4 shadow-xl ${
                isBasicPlan ? 'bg-white' : 'pointer-events-none cursor-not-allowed bg-red-300 '
            } m-auto max-w-4xl transform cursor-pointer hover:translate-x-1 hover:bg-gray-300 `}
            onClick={thisOnClick}
        >
            <h6 className="-underline-offset-1 text-2xl font-bold underline">
                {result.symbol} - {result.instrument_name}
            </h6>
            <div className="mt-4 sm:flex">
                <div className="flex-1 pr-2">
                    <h6 className="mb-2 text-lg font-bold">Exchange: {result.exchange}</h6>
                    <p className="text-gray-600">Exchange Timezone: {result.exchange_timezone}</p>
                </div>
                <div className="flex-1 px-2">
                    <h6 className="mb-2 text-lg font-bold">MIC Code: {result.mic_code}</h6>
                    <p className="text-gray-600">Instrument Type: {result.instrument_type}</p>
                </div>
                <div className="flex-1 px-2">
                    <h6 className="mb-2 text-lg font-bold">Currency: {result.currency}</h6>
                    <p className="text-gray-600">Country: {result.country}</p>
                </div>
                <div className="flex-1 pl-2">
                    <p className="mb-2 text-gray-600">Access - Global: {result.access.global}</p>
                    <p className="text-gray-600">Access - Plan: {result.access.plan}</p>
                </div>
            </div>
        </div>
    );
};

TickerSearchResult.propTypes = {
    result: PropTypes.shape({
        symbol: PropTypes.string,
        instrument_name: PropTypes.string,
        exchange: PropTypes.string,
        mic_code: PropTypes.string,
        exchange_timezone: PropTypes.string,
        instrument_type: PropTypes.string,
        country: PropTypes.string,
        currency: PropTypes.string,
        access: PropTypes.shape({
            global: PropTypes.string,
            plan: PropTypes.string,
        }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default TickerSearchResult;
