import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import { withAuth } from '@/utils/auth';
import { Grid, Typography, Divider, Box } from '@mui/material';
const DashPage = () => {
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
                    <SearchBar />
                </Grid>
                <Grid item xs={12} md={6}>
                    <UserInfoCard />
                    <UserTickers />
                </Grid>
            </Grid>
        </Box>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
