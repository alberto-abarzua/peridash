import WarningButton from '@/components/general/buttons/WarningButton';
import { logout } from '@/utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
const LogoutButton = () => {
    return (
        <WarningButton icon={<LogoutIcon />} onClick={logout} text="Logout" className="rounded">
            Logout
        </WarningButton>
    );
};

export default LogoutButton;
