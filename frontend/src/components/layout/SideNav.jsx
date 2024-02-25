import NavLink from '@/components/layout/NavLink';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import SupabaseContext from '@/utils/supabase/context';
import { useContext } from 'react';
import { logout } from '@/utils/supabase/auth';

import { useState, useRef } from 'react';
function SideNavBar() {
    const [isVisible, setIsVisible] = useState(false);
    const sideNavRef = useRef(null);
    const supabase = useContext(SupabaseContext);

    const navigation = (
        <div
            ref={sideNavRef}
            className={
                'absolute z-50 h-screen w-64 transform flex-col bg-darker-500 p-4 opacity-90 duration-300 ' +
                (isVisible ? 'translate-x-0' : '-translate-x-64')
            }
        >
            <div className="flex">
                <StackedLineChartIcon className="text-4xl text-white " />
                <h2 className="inline-block w-full text-center text-4xl text-white">Peridash</h2>
            </div>
            <div className="m-auto mb-10 h-10 w-full self-center border-b border-b-gray-400 align-middle"></div>
            <NavLink
                text="Dashboard"
                path="/dashboard/"
                icon={<SpaceDashboardIcon className="text-3xl text-white" />}
            ></NavLink>
            <NavLink
                text="Settings"
                path="/settings"
                icon={<SettingsIcon className="text-3xl text-white" />}
            ></NavLink>
            <NavLink
                text="Logout"
                path="/"
                onClick={() => logout(supabase)}
                icon={<LogoutIcon className="text-3xl text-red-600" />}
            ></NavLink>
        </div>
    );

    const toolbar = (
        <div
            onClick={() => setIsVisible(!isVisible)}
            className="flex cursor-pointer rounded px-4 py-3 text-white hover:text-gray-400 "
        >
            <StackedLineChartIcon className="text-5xl " />
            <h1 className="pl-2 text-4xl">Peridash</h1>
        </div>
    );

    const backdrop = (
        <div
            onClick={() => setIsVisible(false)}
            className={`fixed inset-0 z-40 bg-gray-800 bg-opacity-70 transition-opacity ${
                isVisible ? 'block' : 'hidden'
            }`}
        />
    );

    return (
        <div className="flex">
            {navigation}
            {backdrop}
            {toolbar}
        </div>
    );
}

export default SideNavBar;
