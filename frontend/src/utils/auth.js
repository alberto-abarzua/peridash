import api from '@/utils/api';
import cookie from 'js-cookie';
const createToken = async (email, password) => {
    const response = await api.post('user/token/', { email, password });
    if (response.status === 200 && response.data && response.data.token) {
        setToken(response.data.token);
    }
}

const setToken = (token) => {
    cookie.set('authToken', token, { secure: true });
}

const getToken = () => {
    return cookie.get('authToken');
}

const removeToken = () => {
    cookie.remove('authToken');
}


const verifyAuth = async (req) => {
    const token = req.cookies.authToken;
    if (!token) {
        return false;
    }
    try {
        const response = await axios.get( process.env.NEXT_PUBLIC_BACKEND_URL + "/user/me/", 
            { headers: { 'Authorization': `Token ${token}` }
        });
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { setToken, getToken, removeToken ,createToken, verifyAuth};