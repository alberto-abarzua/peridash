import axios from 'axios';
import { useEffect, useState } from 'react';

import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';

const UserInfoCard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');

            if (token) {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/user/me',
                    {
                        headers: { Authorization: `Token ${token}` },
                    }
                );

                setUser(response.data);
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <h2>{user.email}</h2>
                    <LogoutButton />
                </div>
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default UserInfoCard;
