import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';
const DashPage = () => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

    return (
        <div>
            <h1>Test home</h1>
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
