import axios from 'axios';
const baseUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/';

const api = axios.create({
    baseURL: baseUrl,
});

api.interceptors.request.use(request => {
    const token = localStorage.getItem('access_token');
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
});

export default api;
