import { useOutlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader from react-spinners
import Login from '@/components/auth/Login';
import { Toaster } from '@/components/ui/sonner';
import { Navigate } from 'react-router-dom';

export default function Root() {
    let Outlet = useOutlet();
    const { session } = useSelector(state => state.user);
    let loading = useSelector(state => state.ticker.loading);

    return (
        <>
            <div className="h-full  min-h-screen w-full">
                <SideNav />
                {session ? (
                    !loading ? (
                        Outlet ? (
                            Outlet
                        ) : (
                            <Navigate to="/dashboard" replace={true} />
                        )
                    ) : (
                        <div className="flex h-full min-h-screen flex-col items-center justify-center">
                            <ClipLoader
                                className="relative bottom-20"
                                color="white"
                                size={50}
                                loading={loading}
                            />
                            <p className="relative bottom-16 text-lg italic text-white">
                                Loading your tickers...
                            </p>
                        </div>
                    )
                ) : (
                    <div className="flex justify-center">
                        <Login />
                    </div>
                )}
            </div>
            <Toaster />
        </>
    );
}
