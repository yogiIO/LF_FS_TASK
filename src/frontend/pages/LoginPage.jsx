import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/SessionContext';
import { getErrorMessage } from '../api/client';
import AuthLayout from '../components/AuthLayout';

function LoginPage() {
    const { currentUser, authReady, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (authReady && currentUser) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(getErrorMessage(err, 'Login failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Log in">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <Button fullWidth type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Please wait...' : 'Log in'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
                No account? <Link component={RouterLink} to="/register">Sign up</Link>
            </Typography>
        </AuthLayout>
    );
}

export default LoginPage;
