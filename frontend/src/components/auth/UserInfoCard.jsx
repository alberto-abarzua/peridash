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
            console.log('USER', user);
            setUser(user);
        };
        getUserInfo();
    }, [supabase.auth]);

    return (
        <div className="flex w-3/5  flex-row items-center justify-start rounded-md bg-slate-300 bg-opacity-65 px-7  py-4 text-xl">
            <span className='mr-3 text-gray-950'>Email: </span> <span className=' text-gray-700'>{user?.email}</span>
        </div>
    );
};

export default UserInfoCard;
