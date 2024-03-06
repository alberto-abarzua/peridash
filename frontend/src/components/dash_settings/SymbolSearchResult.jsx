import PropTypes from 'prop-types';

const SymbolSearchResult = ({ result, onClick }) => {
    const isBasicPlan =
        result.access.plan.toLowerCase() === 'basic' || result.access.plan.toLowerCase() === 'grow';
    let thisOnClick = () => {
        onClick(result.symbol, result.exchange, result.mic_code);
    };

    return (
        <div
            className={`w-full rounded-lg bg-opacity-60 px-4  py-2 shadow-lg drop-shadow-lg lg:w-[700px]  ${
                isBasicPlan
                    ? 'bg-emerald-400 text-white '
                    : 'pointer-events-none cursor-not-allowed bg-red-200 text-gray-800 '
            } m-auto max-w-4xl transform cursor-pointer hover:translate-x-4 `}
            onClick={thisOnClick}
        >
            <h6 className="-underline-offset-1 text-xl font-semibold underline underline-offset-4 ">
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
    result: PropTypes.object,
    onClick: PropTypes.func,
};

export default SymbolSearchResult;
