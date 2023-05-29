import api from '@/utils/api';

import axios from 'axios';
import cookie from 'js-cookie';
const createToken = async (email, password) => {
    const response = await api.post('user/token/', { email, password });
    if (response.status === 200 && response.data && response.data.token) {
        setToken(response.data.token);
        return true;
    }
    return false;
};

const setToken = token => {
    cookie.set('authToken', token, { secure: true });
};

const getToken = () => {
    return cookie.get('authToken');
};

const removeToken = () => {
    cookie.remove('authToken');
};

const verifyAuth = async req => {
    const token = req.cookies.authToken;
    if (!token) {
        return false;
    }
    try {
        const response = await axios.get(
            process.env.PRIVATE_BACKEND_URL + '/user/me/',
            { headers: { Authorization: `Token ${token}` } }
        );
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
};

function withAuth(getServerSidePropsFunc) {
    return async context => {
        const authenticated = await verifyAuth(context.req);
        if (!authenticated) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/login',
                },
                props: {},
            };
        }

        // Call the provided getServerSideProps function
        let props = {};
        if (getServerSidePropsFunc) {
            props = await getServerSidePropsFunc(context);
        }

        return { props };
    };
}

export { setToken, getToken, removeToken, createToken, verifyAuth, withAuth };
