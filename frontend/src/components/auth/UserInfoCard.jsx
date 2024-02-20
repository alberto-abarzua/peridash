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
            console.log(user);
            setUser(user);
        };
        getUserInfo();
    }, [supabase]);

    // TODO: style using tailwind
    // TODO: add a loading spinner
    // TODO: show the user current email (user.email)

    return (
        <div className="flex w-3/5  flex-row items-center justify-start rounded-md bg-slate-400 px-7  py-4 text-xl">
            <span className='mr-3 text-gray-950'>Email: </span> <span className=' text-gray-700'>{user?.email}</span>
        </div>
    );
};

export default UserInfoCard;
