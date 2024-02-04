import { useOutlet } from 'react-router-dom';
import Login from '@/components/auth/Login';
import SupabaseContext from '@/utils/supabase/context';
import { useContext, useState,useEffect } from 'react';

export default function Root() {
    let Outlet = useOutlet();
    let supabase = useContext(SupabaseContext);

    const [session, setSession] = useState(null);
    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            setSession(data.session);
            
        }
        getSession();
    }, []);

    return (
        <div className="">
            {Outlet && session != null ? (
                Outlet
            ) : (
                <div className="mt-20 flex h-full flex-col items-center  ">
                    <Login />
                </div>
            )}
        </div>
    );
}
