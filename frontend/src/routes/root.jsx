import { useOutlet } from 'react-router-dom';
import Login from '@/components/auth/Login';
import { SupabaseContext } from '@/utils/supabase/context';
import { useContext, useState, useEffect } from 'react';
import SideNav from '@/components/layout/SideNav';
import { ClipLoader } from 'react-spinners';

export default function Root() {
    let Outlet = useOutlet();
    let supabase = useContext(SupabaseContext);
    let [session, setSession] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            console.log(data);
            if (data.session == null) {
                console.log('No session');
                setLoading(false);
                return;
            }
            if (error) {
                return;
            }
            localStorage.setItem('access_token', data.session.access_token);
            setSession(data);

            setLoading(false);
        };
        getSession();
    }, [setSession, supabase.auth]);

    return (
        <>
            {loading && (
                <div className="flex h-screen items-center justify-center">
                    <ClipLoader color="#ffffff" loading={loading} size={150} />
                </div>
            )}
            <div className="h-full min-h-screen w-full">
                {session != null && <SideNav />}
                {Outlet && session != null ? (
                    <div className="h-full w-full">{Outlet}</div>
                ) : (
                    <div className="flex h-full justify-center pt-40  ">
                        <Login />
                    </div>
                )}
            </div>
        </>
    );
}
