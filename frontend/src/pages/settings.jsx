import { withAuth } from '@/utils/auth';
import { Grid } from '@mui/material';
const DashPage = () => {
    return (
        <div>
            <h1>Settings.jsx</h1>
        </div>
    );
};
export const getServerSideProps = withAuth();

export default DashPage;
