import { createToken, getToken } from '@/utils/auth';
import { Box } from '@mui/material';

import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './LoginForm.module.css';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // Initialize useRouter
    const handleSubmit = async event => {
        event.preventDefault();

        let success = await createToken(email, password);
        console.log(success);
        console.log(getToken());
        if (success) {
            router.push('/');
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
