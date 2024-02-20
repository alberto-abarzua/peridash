
import axios from 'axios';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const baseUrl = supabaseUrl + '/functions/v1/';
console.log('baseUrl', baseUrl);

const api = axios.create({
    baseURL: baseUrl,
});

axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
});

export default api;
