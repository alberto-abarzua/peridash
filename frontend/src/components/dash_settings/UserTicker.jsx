import InconTextInput from '@/components/general/inputs/IconTextInput';
import api from '@/utils/api';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { tickerSliceActions } from '@/redux/tickerSlice';

const UserTicker = ({ result }) => {
    const [favorite, setFavorite] = useState(result.ticker.is_favorite);
    const [buy, setBuy] = useState(result.ticker.buy || 0);
    const [gain, setGain] = useState(result.ticker.gain || 0);
    const [loss, setLoss] = useState(result.ticker.loss || 0);
    const [firstRender, setFirstRender] = useState(true);

    const dispatch = useDispatch();

    const updateTicker = useCallback(async () => {
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
        }
    });

    const handleBuyChange = useCallback(
        event => {
            setBuy(event.target.value);
        },
        [setBuy, updateTicker]
    );

    const handleGainChange = useCallback(
        event => {
            setGain(event.target.value);
        },
        [setGain, updateTicker]
    );

    const handleLossChange = useCallback(
        event => {
            setLoss(event.target.value);
        },
        [setLoss, updateTicker]
    );

    const handleFavorite = useCallback(async () => {
        setFavorite(prev => !prev);
    }, [setFavorite, updateTicker]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
        updateTicker();
    }, [favorite, buy, gain, loss]);

    const handleDelete = useCallback(async () => {
        await api.delete(`/user_ticker/tickers/`, {
            params: {
                ticker_id: result.ticker.id,
            },
        });

        dispatch(tickerSliceActions.updateTickers());
    }, [result.ticker.id, dispatch]);

    return (
        <div
            className={`group relative w-full rounded-sm border-gray-400 bg-white bg-opacity-90 px-4 py-2 shadow-sm shadow-gray-600  `}
        >
            <div className="flex-col">
                <div className="flex h-full w-full pt-1">
                    <div className="flex-grow self-center">
                        <h5 className="text-lg group-hover:font-semibold ">
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
                                <div className="transform text-5xl text-gray-500 transition-all duration-100  hover:text-yellow-500">
                                    ☆
                                </div>
                            )}
                        </button>
                    </div>
                    <div className="flex-shrink-0 self-center pr-3">
                        <button
                            onClick={handleDelete}
                            className="m-0 my-0 h-8 w-8 translate-x-1 scale-[1.04] transform rounded-full border-none text-gray-800 hover:-translate-y-1  hover:scale-105  hover:bg-red-600 hover:text-white focus:border-none"
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
        </div>
    );
};

export default UserTicker;
