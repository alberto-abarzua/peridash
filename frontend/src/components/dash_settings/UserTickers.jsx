import api from '@/utils/api';

import { useState, useEffect } from 'react';

const UserTickers = () => {
    const [userTickers, setUserTickers] = useState([]);
    useEffect(() => {
        const getUserTickers = async () => {
            let response = await api.get('/ticker/user-tickers/');
            console.log(response.data);
            setUserTickers(response.data);
        };
        getUserTickers();
    }, []);
    console.log(userTickers);
    return <h1>hola</h1>;
};

export default UserTickers;
