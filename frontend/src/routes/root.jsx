import { useOutlet } from 'react-router-dom';
import SideNav from '@/components/layout/SideNav';
import SupabaseAuth from '@/components/auth/SupabaseAuth';
import { useEffect } from 'react';

export default function Root() {
    let Outlet = useOutlet();
    
    return (
        <>
            <div className="h-full min-h-screen w-full">
                <SideNav />
                <SupabaseAuth Outlet={Outlet}></SupabaseAuth>
            </div>
        </>
    );
}
