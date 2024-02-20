import { useOutlet } from 'react-router-dom';
import Login from '@/components/auth/Login';
import { SupabaseContext, SessionContext } from '@/utils/supabase/context';
import { useContext, useState, useEffect } from 'react';
import SideNav from '@/components/layout/SideNav';
import api from '@/utils/api';

export default function Root() {
    let Outlet = useOutlet();
    let supabase = useContext(SupabaseContext);
    let [session, setSession] = useState();
    const [output, setOutput] = useState(null);
    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                return;
            }
            setSession(data.session);
        };
        getSession();
    }, []);
    return (
        <SessionContext.Provider value={{ session, setSession }}>
            <SideNav />
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="">
                    {Outlet && session != null ? (
                        Outlet
                    ) : (
                        <div className="mt-20 flex h-full flex-col items-center  ">
                            <Login />
                        </div>
                    )}
                </div>
            </div>
        </SessionContext.Provider>
    );
}
