import { useOutlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import SupabaseAuth from '@/components/auth/SupabaseAuth';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader from react-spinners

export default function Root() {
    let Outlet = useOutlet();
    let loading = useSelector(state => state.ticker.loading);

    const token = localStorage.getItem('access_token');
    loading = token ? loading : false;


    return (
        <>
            <div className="h-full min-h-screen w-full">
                <SideNav />
                {loading ? (
                    <div className="flex flex-col h-full min-h-screen items-center justify-center">
                        <ClipLoader
                            className="relative bottom-20"
                            color="white"
                            size={50}
                            loading={loading}
                        />
                        <p className='relative bottom-16 text-white italic text-lg'>Loading your tickers...</p>
                    </div>
                ) : (
                    <SupabaseAuth Outlet={Outlet}></SupabaseAuth>
                )}
            </div>
        </>
    );
}
