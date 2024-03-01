import axios from 'axios';
const baseUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/';
import store from '@/redux/store';
import { userSliceActions } from '@/redux/userSlice';

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
            store.dispatch(userSliceActions.logout());
            return;
        }
        store.dispatch(userSliceActions.updateSession());
        return Promise.reject(error);
    }
);

export default api;
