import { Box } from '@mui/material';

import api from '@/utils/api';
import {createToken} from '@/utils/auth';
import React, { useState,useEffect } from 'react';

import styles from './LoginForm.module.css';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async event => {
        event.preventDefault();
       
        createToken(email, password)


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
