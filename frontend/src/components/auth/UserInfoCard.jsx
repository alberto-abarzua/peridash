import { useContext, useState, useEffect } from 'react';
import SupabaseContext from '@/utils/supabase/context';
const UserInfoCard = () => {
    const [user, setUser] = useState(null);
    const supabase = useContext(SupabaseContext);

    useEffect(() => {
        const getUserInfo = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        getUserInfo();
    }, [supabase.auth]);

    return (
        <div className=" flex w-full py-4 px-5   rounded-md border border-gray-500 bg-gray-700 bg-opacity-85 shadow-sm shadow-gray-600">
            <span className="mr-3 text-white font-semibold">Current User: </span>{' '}
            <span className="text-white italic">{user?.email}</span>
        </div>
    );
};

export default UserInfoCard;
