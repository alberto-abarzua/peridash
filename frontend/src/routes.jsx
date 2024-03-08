//routes.js
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/home';
import Root from '@/pages/root';
import ErrorPage from '@/components/layout/misc/ErrorPage';
import Login from '@/pages/login';
import Settings from '@/pages/settings';
import Dashboard from '@/pages/dashboard';
import PrivateRoute from './components/auth/PrivateRoute';

import { Navigate } from 'react-router-dom';
const router = createBrowserRouter([
    {
        path: '/live/',
        element: <PrivateRoute element={Root} />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'settings',
                element: <Settings />,
            },

            {
                path: 'dashboard',
                element: <Dashboard />,
            },
        ],
    },
    {
        path: 'login',
        errorElement: <ErrorPage />,
        element: <Login />,
    },
    {
        path: '/',
        errorElement: <ErrorPage />,
        element: <Home />,
    },
    {
        path: '/dashboard',
        element: <Navigate to="/live/dashboard" />,
    },
    {
        path: '/settings',
        element: <Navigate to="/live/settings" />,
    },
]);
export default router;
