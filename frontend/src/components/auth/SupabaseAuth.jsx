import Login from '@/components/auth/Login';
import { useState } from 'react';

import PropTypes from 'prop-types';

const SupabaseAuth = ({ children, Outlet }) => {
    const [session, setSession] = useState(null);

    return (
        <>
            <div className="h-full min-h-screen w-full">
                {Outlet && session != null ? (
                    <div className="h-full w-full">{Outlet}</div>
                ) : (
                    <>
                        <div className="flex h-full justify-center pt-40  ">
                            <Login session={session} setSession={setSession} />
                        </div>
                        {children}
                    </>
                )}
            </div>
        </>
    );
};

SupabaseAuth.propTypes = {
    children: PropTypes.node,
    Outlet: PropTypes.node,
};

export default SupabaseAuth;
