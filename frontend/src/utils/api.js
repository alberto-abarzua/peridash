import axios from 'axios';
// Create an instance of axios
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL // Base domain
});

// Modify the request before it is sent to always include a token and ensure trailing slash
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Change this to use your method of storing tokens
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;