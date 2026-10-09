import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/SessionContext';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../api/client';
import AuthLayout from '../components/AuthLayout';

function RegisterPage() {
    const { currentUser, authReady, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
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
            await register({ username, email, password });
            showToast('Profile created, now you can login', 'success');
            navigate('/login');
        } catch (err) {
            setError(getErrorMessage(err, 'Sign up failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create an account">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
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
                    {loading ? 'Please wait...' : 'Sign up'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <Link component={RouterLink} to="/login">Log in</Link>
            </Typography>
        </AuthLayout>
    );
}

export default RegisterPage;
