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
                <Divider
                    style={{
                        backgroundColor: 'rgba(195, 195, 195, 0.3)',
                        height: '1px',
                    }}
                />
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h2" sx={{ color: 'white' }}>
                        Control Panel
                    </Typography>
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
