import api from '@/utils/api';
import { useEffect, useState } from 'react';

import LogoutButton from './LogoutButton';

const UserInfoCard = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUser = async () => {
            let response = await api.get('/user/me/');
            setUser(response.data);
            setIsLoading(false); // Stop the loading spinner
        };
        fetchUser();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                {/* You might need to style or replace the spinner if you don't have a similar utility in your Tailwind setup */}
                <div className="spinner h-20 w-20"></div>
            </div>
        );
    }

    return (
        <div className="flex w-full rounded-md bg-gray-800 p-4">
            <div className="flex-grow self-center text-2xl text-white ">
                {user ? user.email : 'No User'}
            </div>
            <div className="mr-3 flex-shrink self-center">
                {user && <LogoutButton />}
            </div>
        </div>
    );
};

export default UserInfoCard;
