import { useOutlet } from 'react-router-dom';
import Login from '@/components/auth/Login';

export default function Root() {
    let Outlet = useOutlet();
    return (
        <div className="">
            {Outlet ? (
                Outlet
            ) : (
                <div className="flex h-full flex-col items-center mt-20  ">
                    <Login />
                </div>
            )}
        </div>
    );
}
