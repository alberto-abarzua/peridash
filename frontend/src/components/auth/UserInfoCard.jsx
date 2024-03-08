import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSelector, useDispatch } from 'react-redux';
import { userSliceActions } from '@/redux/userSlice';

import { UserCircleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
const UserInfoCard = () => {
    const dispatch = useDispatch();
    const { session } = useSelector(state => state.user);

    const handleLogout = async () => {
        dispatch(userSliceActions.logout());
    };
    return (
        <div className="flex  w-fit flex-row items-center justify-center gap-x-2 rounded-md text-white   shadow drop-shadow-lg lg:mx-5 lg:w-full ">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-full w-full items-center justify-center gap-x-2 px-4 py-2">
                    <span className="whitespace-nowrap">Mi Sesión</span>
                    <UserCircleIcon className="h-10 w-10 rounded-full stroke-white stroke-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="text-md">
                        {session && session.user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-md">
                        <div onClick={handleLogout} className="flex gap-x-2 ">
                            <span>Cerrar sesión</span>

                            <ArrowLeftStartOnRectangleIcon className="size-5 rounded-full stroke-black stroke-1 text-black" />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserInfoCard;
