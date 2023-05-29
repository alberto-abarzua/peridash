import { getToken } from '@/utils/auth';

import axios from 'axios';
// Create an instance of axios

let backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (backendUrl.startsWith('"') && backendUrl.endsWith('"')) {
    backendUrl = backendUrl.slice(1, -1); // Remove the quotation marks
}

const api = axios.create({
    baseURL: backendUrl, // Base domain
});

// Modify the request before it is sent to always include a token and ensure trailing slash
api.interceptors.request.use(
    config => {
        const token = getToken(); // Change this to use your method of storing tokens
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        console.log('url', config.url);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
