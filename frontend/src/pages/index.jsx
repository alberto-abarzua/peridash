import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';
const DashPage = () => {
    return (
        <div>
            <h1>Index.jsx</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
                <Grid item xs={12} md={6}></Grid>
            </Grid>
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
