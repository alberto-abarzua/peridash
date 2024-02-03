import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from '@/routes/root';
import ErrorPage from '@/error-page';
import About from '@/routes/about';
import Contact from '@/routes/contact';
import SupabaseContext from '@/utils/supabase/context';
import supabase from "@/utils/supabase/supabaseClient"

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
                path: 'contact',
                element: <Contact />,
            },
        ],
    },
]);

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <SupabaseContext.Provider value = {supabase}>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </SupabaseContext.Provider>
);
