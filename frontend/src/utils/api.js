import axios from 'axios';
const baseUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/';
import store from '@/redux/store';
import { userSliceActions } from '@/redux/slices/userSlice';
import supabase from './supabase/client';

const api = axios.create({
    baseURL: baseUrl,
});

api.interceptors.request.use(request => {
    const {
        user: { session },
    } = store.getState();
    const token = session?.access_token;

    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    } else {
        request.headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }
    return request;
});

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            const {
                data: { session: refreshedSession },
                error: refreshError,
            } = supabase.auth.refreshSession();

            if (refreshError) {
                console.error('Session refresh error:', refreshError);
                store.dispatch(userSliceActions.logout());
                return;
            }
            store.dispatch(userSliceActions.setUserSession(refreshedSession));

            return;
        }
        return Promise.reject(error);
    }
);

export default api;
