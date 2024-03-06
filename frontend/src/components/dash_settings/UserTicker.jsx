import InconTextInput from '@/components/general/inputs/IconTextInput';
import api from '@/utils/api';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';

import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { tickerSliceActions } from '@/redux/tickerSlice';
import PropTypes from 'prop-types';

const UserTicker = ({ result }) => {
    const [favorite, setFavorite] = useState(result.ticker.is_favorite);
    const [buy, setBuy] = useState(result.ticker.buy || 0);
    const [gain, setGain] = useState(result.ticker.gain || 0);
    const [loss, setLoss] = useState(result.ticker.loss || 0);
    const [isDirty, setIsDirty] = useState(false);

    const dispatch = useDispatch();

    const handleBuyChange = useCallback(
        event => {
            setBuy(event.target.value);
            setIsDirty(true);
        },
        [setBuy, setIsDirty]
    );

    const handleGainChange = useCallback(
        event => {
            setGain(event.target.value);
            setIsDirty(true);
        },
        [setGain, setIsDirty]
    );

    const handleLossChange = useCallback(
        event => {
            setLoss(event.target.value);
            setIsDirty(true);
        },
        [setLoss, setIsDirty]
    );

    const handleFavorite = useCallback(async () => {
        setFavorite(prev => !prev);
        setIsDirty(true);
    }, [setFavorite, setIsDirty]);

    const handleSave = useCallback(async () => {
        let response = await api.put(`/user_ticker/tickers/`, {
            ticker_id: result.ticker.id,
            ticker_info: {
                is_favorite: favorite,
                buy: buy,
                gain: gain,
                loss: loss,
            },
        });

        if (response.status === 200) {
            dispatch(tickerSliceActions.updateTickers());
            toast.success(`Updated Ticker ${result.symbol.symbol}`);
            setIsDirty(false);
        } else {
            toast.error('Error updating ticker');
        }
    }, [buy, dispatch, favorite, gain, loss, result]);

    const handleDelete = useCallback(async () => {
        await api.delete(`/user_ticker/tickers/`, {
            params: {
                ticker_id: result.ticker.id,
            },
        });

        if (response.status === 200) {
            dispatch(tickerSliceActions.updateTickers());
            toast.success(`Deleted Ticker ${result.symbol.symbol}`);
        }

        dispatch(tickerSliceActions.updateTickers());
    }, [result.ticker.id, dispatch]);

    return (
        <div
            className={`group relative w-full rounded-sm border-gray-400 bg-white bg-opacity-90 px-4 py-2 shadow-sm shadow-gray-600`}
        >
            <div className="flex-col">
                <div className="flex h-full w-full items-center justify-center pt-1">
                    <div className="flex-grow self-center">
                        <h5 className="text-lg group-hover:font-semibold">
                            {result.symbol.symbol + ':' + result.symbol.exchange}
                        </h5>
                    </div>
                    <div className="z-20 flex-shrink-0 self-center">
                        <button onClick={handleFavorite}>
                            {favorite ? (
                                <div className="text-5xl text-yellow-500 hover:text-yellow-300">
                                    ★
                                </div>
                            ) : (
                                <div className="transform text-5xl text-gray-500 transition-all duration-100 hover:text-yellow-500">
                                    ☆
                                </div>
                            )}
                        </button>
                    </div>
                    <div className="flex-shrink-0 self-center pl-3">
                        <button
                            onClick={handleDelete}
                            className="m-0 my-0 h-8 w-8   transform rounded-full border-none text-gray-800  hover:text-red-800 focus:border-none"
                        >
                            <DeleteIcon></DeleteIcon>
                        </button>
                    </div>
                </div>

                <div
                    className={`w-full transform items-start transition-all duration-500 ${
                        favorite ? 'flex' : 'hidden'
                    }`}
                >
                    <div className="m-auto box-border flex w-full space-x-2">
                        <InconTextInput
                            icon={<AttachMoneySharpIcon />}
                            placeholder="Buy"
                            value={buy}
                            onChange={handleBuyChange}
                        />
                        <InconTextInput
                            icon={<AddIcon />}
                            placeholder="Gain"
                            value={gain}
                            onChange={handleGainChange}
                        />
                        <InconTextInput
                            icon={<RemoveIcon />}
                            placeholder="Loss"
                            value={loss}
                            onChange={handleLossChange}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-4 flex w-full flex-row items-end justify-end">
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="relative left-4 scale-[0.8] transform cursor-pointer rounded-md border-none bg-green-600 px-4 py-2  text-white   hover:bg-green-700 hover:text-white focus:border-none"
                >
                    <SaveIcon></SaveIcon> Save
                </button>
            </div>
        </div>
    );
};

UserTicker.propTypes = {
    result: PropTypes.object,
};

export default UserTicker;
