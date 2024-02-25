import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useContext } from 'react';
import SupabaseContext from '@/utils/supabase/context';
import PropTypes from 'prop-types';

const Login = ({ session, setSession }) => {
    const supabase = useContext(SupabaseContext);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const token = session?.access_token;

            if (!token) {
                localStorage.removeItem('access_token');
            }
            const localToken = localStorage.getItem('access_token');
            if (token && token !== localToken) {
                localStorage.setItem('access_token', token);
            }
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, setSession]);

    if (!session) {
        return (
            <div className="rounded-md bg-gray-900 p-4">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={[]}
                    theme={'dark'}
                />
            </div>
        );
    } else {
        window.location.href = '/dashboard';
        return <div></div>;
    }
};

Login.propTypes = {
    session: PropTypes.object,
    setSession: PropTypes.func,
};
export default Login;
