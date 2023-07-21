import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import api from '@/utils/api';
import { withAuth } from '@/utils/auth';
import { Grid, Typography, Divider, Box } from '@mui/material';

import { useState, useEffect, useCallback } from 'react';

const SettingsPage = () => {
    const [userTickers, setUserTickers] = useState([]);

    const getUserTickers = useCallback(async () => {
        try {
            let response = await api.get('/ticker/user-tickers/');
            setUserTickers(response.data);
        } catch (error) {
            console.error('Error fetching user tickers', error);
        }
    }, []);

    useEffect(() => {
        getUserTickers();
    }, [getUserTickers]);
    return (
        
        <Box>


            <Grid>
                <Divider className = "bg-slate-300 h-0"/>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <div className="text-7xl text-white p-3">Dash Settings</div>
                    <SearchBar getUserTickers={getUserTickers} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <UserInfoCard />
                    <UserTickers
                        userTickers={userTickers}
                        getUserTickers={getUserTickers}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
export const getServerSideProps = withAuth();

export default SettingsPage;
