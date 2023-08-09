import InconTextInput from '@/components/general/inputs/IconTextInput';
import useNotification from '@/components/general/notification/useNotification';
import api from '@/utils/api';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const UserTicker = ({ result, getUserTickers }) => {
    const { showNotification, renderNotification } = useNotification();

    const [favorite, setFavorite] = useState(result.is_favorite);
    const [buy, setBuy] = useState(result.buy);
    const [gain, setGain] = useState(result.gain);
    const [loss, setLoss] = useState(result.loss);
    const isFirstRender = useRef(true);

    const handleDelete = async () => {
        await api.delete(`/ticker/user-tickers/${result.id}/`);
        getUserTickers();
    };

    const handleBuyChange = event => {
        setBuy(event.target.value);
    };

    const handleGainChange = event => {
        setGain(event.target.value);
    };

    const handleLossChange = event => {
        setLoss(event.target.value);
    };

    useEffect(() => {
        const updateTicker = async () => {
            let response = await api.patch(`/ticker/user-tickers/${result.id}/`, {
                is_favorite: favorite,
                buy: buy,
                gain: gain,
                loss: loss,
            });
            if (response.status === 200) {
                getUserTickers();
                showNotification(
                    'Ticker Updated',
                    <CheckIcon className=" text-green-500" />,
                    'bg-green-100'
                );
            }
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        updateTicker();
    }, [favorite, buy, gain, loss, getUserTickers, result.id, showNotification]);

    const handleFavorite = () => {
        setFavorite(!favorite);
    };

    return (
        <div
            className={`relative mb-1  box-border  rounded border border-gray-400  bg-slate-100  pl-3 shadow-2xl transition-all duration-200 ${
                favorite ? 'h-36' : 'h-16'
            }`}
        >
            {renderNotification()}
            <div className="flex-col">
                <div className="flex h-full w-full pt-1">
                    <div className="flex-grow self-center">
                        <h5 className="text-lg ">{result.symbol.name}</h5>
                    </div>
                    <div className="z-20 flex-shrink-0 self-center">
                        <button onClick={handleFavorite}>
                            {result.is_favorite ? (
                                <div className="text-5xl text-yellow-500">★</div>
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
                    className={`absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform items-start px-2 pb-5 duration-150 ${
                        favorite
                            ? 'translate-y-0 opacity-100'
                            : ' -z-10  h-20 -translate-y-4 opacity-0'
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

UserTicker.propTypes = {
    result: PropTypes.shape({
        id: PropTypes.string,
        is_favorite: PropTypes.bool,
        buy: PropTypes.number,
        gain: PropTypes.number,
        loss: PropTypes.number,
        symbol: PropTypes.shape({
            name: PropTypes.string,
            exchange: PropTypes.string,
            id: PropTypes.string,
            symbol: PropTypes.string,
        }).isRequired,
    }).isRequired,
    getUserTickers: PropTypes.func.isRequired,
};

export default UserTicker;
