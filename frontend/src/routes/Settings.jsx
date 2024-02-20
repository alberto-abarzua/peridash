import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import api from '@/utils/api';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import { SessionContext } from '@/utils/supabase/context';
import { useContext } from 'react';

import { useState, useEffect, useCallback } from 'react';

const Settings = () => {
    const [userTickers, setUserTickers] = useState([]);
    const { session } = useContext(SessionContext);

    const getUserTickers = useCallback(async () => {
        try {
            let response = await api.get('/user_ticker/tickers/', {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            });
            setUserTickers(response.data);
        } catch (error) {
            // show noti
        }
    }, []);

    useEffect(() => {
        getUserTickers();
    }, [getUserTickers]);
    return (
        <div className="box-border flex w-screen flex-col p-10 ">
            <div className="my-10 flex  flex-col sm:flex-row">
                <div className="flex  self-center p-3 text-7xl text-white sm:w-1/2 ">
                    <SettingsIcon className="mr-5 text-4xl text-white " />
                    <span className="text-4xl">Dash Settings</span>
                </div>
                <div className="w-full self-center sm:w-1/2">
                    <UserInfoCard />
                </div>
            </div>
            <div className="m-auto mb-10 w-3/4 border-b border-b-slate-400 shadow-lg shadow-white"></div>
            <div className="m-0 w-full flex-col justify-center p-0">
                <div className="mx-auto mb-10 w-full self-center align-middle sm:w-1/2 ">
                    <div className="mb-10 text-3xl text-white">
                        <QueryStatsIcon className="mr-3 text-5xl text-white"></QueryStatsIcon>
                        Add Ticker
                    </div>
                    <SearchBar getUserTickers={getUserTickers} />
                </div>
                <UserTickers userTickers={userTickers} getUserTickers={getUserTickers} />
            </div>
        </div>
    );
};

export default Settings;
