import { Box } from '@mui/material';

import axios from 'axios';
import React, { useState } from 'react';

import styles from './LoginForm.module.css';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        let url = process.env.NEXT_PUBLIC_BACKEND_URL + '/user/token/';
        console.log(url);
        const response = await axios.post(
           url,
            {
                email: email,
                password: password,
            }
        );
        console.log(response);

        if (response.data && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            // go to home page

            window.location.reload();
        }
    };
    return (
        <Box className={styles.outerGrid}>
            <h1 className={styles.title}>Please Login</h1>
            <form onSubmit={handleSubmit}>
                <Box className={styles.loginForm}>
                    <input
                        type="input"
                        placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required={true}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={true}
                    />
                    <button type="submit">Login</button>
                </Box>
            </form>
        </Box>
    );
};

export default LoginForm;
