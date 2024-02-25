import PropTypes from 'prop-types';

const SymbolSearchResult = ({ result, onClick }) => {
    const isBasicPlan =
        result.access.plan.toLowerCase() === 'basic' || result.access.plan.toLowerCase() === 'grow';
    let thisOnClick = () => {
        onClick(result.symbol, result.exchange, result.mic_code);
    };

    // <div className="flex-1 pl-2">
    //     <p className="mb-2 text-gray-600">Access - Global: {result.access.global}</p>
    //     <p className="text-gray-600">Access - Plan: {result.access.plan}</p>
    // </div>
    return (
        <div
            className={`w-full lg:w-[700px] rounded-lg border border-gray-400 px-4 py-2  ${
                isBasicPlan
                    ? 'bg-gray-600 text-white '
                    : 'pointer-events-none cursor-not-allowed bg-red-200 text-gray-800 '
            } m-auto max-w-4xl transform cursor-pointer hover:translate-x-4 hover:bg-gray-700 `}
            onClick={thisOnClick}
        >
            <h6 className="-underline-offset-1 text-2xl font-semibold underline">
                {result.symbol} - {result.instrument_name}
            </h6>
            <div className="mt-2 flex justify-between">
                <div className="flex flex-col ">
                    <span className="text-md  font-semibold">Exchange: </span>
                    <p className="italic "> {result.exchange}</p>
                </div>
                <div className="flex flex-col ">
                    <span className="text-md  font-semibold">Country/Currency </span>
                    <p className="italic "> {result.country + '/' + result.currency}</p>
                </div>
                <div className="flex flex-col ">
                    <span className="text-md font-semibold">Type </span>
                    <p className="italic "> {result.instrument_type}</p>
                </div>
                <div className="flex flex-col ">
                    <span className="text-md  font-semibold">Plan </span>
                    <p className="italic "> {result.access.plan + '/' + result.access.global}</p>
                </div>
            </div>
        </div>
    );
};

SymbolSearchResult.propTypes = {
    result: PropTypes.shape({
        symbol: PropTypes.string,
        instrument_name: PropTypes.string,
        exchange: PropTypes.string,
        mic_code: PropTypes.string,
        exchange_timezone: PropTypes.string,
        instrument_type: PropTypes.string,
        country: PropTypes.string,
        currency: PropTypes.string,
        // access: PropTypes.shape({
        //     global: PropTypes.string,
        //     plan: PropTypes.string,
        // }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default SymbolSearchResult;
