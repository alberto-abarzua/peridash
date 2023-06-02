import { createToken } from '@/utils/auth';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Card,
} from '@mui/material';

import { useRouter } from 'next/router';
import { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async event => {
        event.preventDefault();
        const success = await createToken(email, password);

        if (success) {
            router.push('/');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: '20px',
                }}
            >
                <Typography component="h1" variant="h5">
                    Please Login
                </Typography>
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 1, width: '100%' }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default LoginForm;
