import NavLink from '@/components/layout/NavLink';
import { logout } from '@/utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';

import { useState, useRef } from 'react';
function SideNavBar() {
    const [isVisible, setIsVisible] = useState(false);
    const sideNavRef = useRef(null);

    const navigation = (
        <div
            ref={sideNavRef}
            className={
                'flex-col absolute h-screen w-64 bg-gray-800 p-4 transform duration-300 z-20 ' +
                (isVisible ? 'translate-x-0' : '-translate-x-64')
            }
        >
            <div className="flex">
                <StackedLineChartIcon className="text-4xl text-white " />
                <h2 className="text-4xl text-white inline-block w-full text-center">
                    Peridash
                </h2>
            </div>
            <div className="h-10 m-auto border-b border-b-gray-400 mb-10 w-full self-center align-middle"></div>
            <NavLink
                text="Dashboard"
                path="/"
                icon={<SpaceDashboardIcon className="text-white text-3xl" />}
            ></NavLink>
            <NavLink
                text="Settings"
                path="/settings"
                icon={<SettingsIcon className="text-white text-3xl" />}
            ></NavLink>
            <NavLink
                text="Logout"
                path="/"
                onClick={() => logout()}
                icon={<LogoutIcon className="text-red-600 text-3xl" />}
            ></NavLink>
        </div>
    );

    const toolbar = (
        <div
            onClick={() => setIsVisible(!isVisible)}
            className="flex py-2 px-4 text-white rounded hover:text-gray-400 cursor-pointer "
        >
            <StackedLineChartIcon className="text-5xl " />
            <h1 className="pl-2 text-4xl">Peridash</h1>
        </div>
    );

    const backdrop = (
        <div
            onClick={() => setIsVisible(false)}
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity z-10 ${
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
