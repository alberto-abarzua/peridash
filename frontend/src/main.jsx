import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from '@/routes/root';
import ErrorPage from '@/error-page';
import About from '@/routes/about';
import { SupabaseContext } from '@/utils/supabase/context';
import supabase from '@/utils/supabase/supabaseClient';
import store from '@/redux/store';
import Settings from '@/routes/Settings';
import Dashboard from '@/routes/Dashboard';

import { Provider } from 'react-redux';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'about',
                element: <About />,
            },
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
]);

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <SupabaseContext.Provider value={supabase}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </SupabaseContext.Provider>
    </Provider>
);
