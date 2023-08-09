import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import useNotification from '@/components/general/notification/useNotification';
import api from '@/utils/api';
import { withAuth } from '@/utils/auth';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';

import { useState, useEffect, useCallback } from 'react';

const SettingsPage = () => {
    const { showNotification, renderNotification } = useNotification();
    const [userTickers, setUserTickers] = useState([]);

    const getUserTickers = useCallback(async () => {
        try {
            let response = await api.get('/ticker/user-tickers/');
            setUserTickers(response.data);
        } catch (error) {
            showNotification(
                'Failed to get user Tickers!',
                <ReportProblemIcon className=" text-red-500" />,
                'bg-red-100'
            );
        }
    }, [showNotification]);

    useEffect(() => {
        getUserTickers();
    }, [getUserTickers]);
    return (
        <div className="box-border flex w-screen flex-col p-10 ">
            {renderNotification()}
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

export const getServerSideProps = withAuth();

export default SettingsPage;
