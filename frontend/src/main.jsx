import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from '@/routes/root';
import ErrorPage from '@/error-page';
import store, { persistor } from '@/redux/store';
import Settings from '@/routes/Settings';
import Dashboard from '@/routes/Dashboard';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
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
]);

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </PersistGate>
    </Provider>
);
