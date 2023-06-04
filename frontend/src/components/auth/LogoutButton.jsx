import { logout } from '@/utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
const LogoutButton = () => {
    return (
        <Button
            variant="contained"
            endIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
                mt: 2,
                backgroundColor: 'error.main',
                '&:hover': { backgroundColor: 'error.dark' },
            }}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
