import api from '@/utils/api';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import LogoutButton from './LogoutButton';

const UserInfoCard = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const theme = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            let response = await api.get('/user/me/');
            setUser(response.data);
            setIsLoading(false); // Stop the loading spinner
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh', // 100% of the viewport height
                }}
            >
                <CircularProgress size="5rem" />
            </Box>
        );
    }

    return (
        <Card sx={{ backgroundColor: theme.palette.secondary.dark }}>
            <CardContent>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ color: 'white' }}
                >
                    {user ? user.email : 'No User'}
                </Typography>
                {user && <LogoutButton />}
            </CardContent>
        </Card>
    );
};

export default UserInfoCard;
