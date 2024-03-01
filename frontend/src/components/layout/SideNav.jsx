import NavLink from '@/components/layout/NavLink';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { useDispatch } from 'react-redux';

import { userSliceActions } from '@/redux/userSlice';
import { useState, useRef } from 'react';
function SideNavBar() {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const sideNavRef = useRef(null);

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
                onClick={() => dispatch(userSliceActions.logout())}
                icon={<LogoutIcon className="text-3xl text-red-600" />}
            ></NavLink>
        </div>
    );

    const toolbar = (
        <div
            onClick={() => setIsVisible(!isVisible)}
            className="flex cursor-pointer items-center justify-center rounded-br-full bg-darker-700   px-4 py-2  pr-10 text-white hover:bg-gray-700 hover:text-slate-200 "
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
        <>
            <div className="fixed z-50">
                {navigation}
                {backdrop}
                {toolbar}
            </div>
            <div className="h-20 w-full"></div>
        </>
    );
}

export default SideNavBar;
