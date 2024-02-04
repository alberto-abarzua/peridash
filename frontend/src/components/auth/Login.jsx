import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useContext } from 'react';
import SupabaseContext from '@/utils/supabase/context';

const Login = () => {
    const supabase = useContext(SupabaseContext);
    const [session, setSession] = useState(null);

    useEffect(() => {

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        // providers={['google', 'apple']}
        return (
            <div className="bg-gray-900 p-4 rounded-md">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={[]}
                    theme={'dark'}
                />
            </div>
        );
    } else {
        return <div>
            <h1>Logged in</h1>
            <button className='bg-red-600 px-4 py-2 hover:bg-red-500 text-white rounded-sm border-gray-600 ' onClick={() => supabase.auth.signOut()}>Log out</button>
            </div>;
    }
};

export default Login;