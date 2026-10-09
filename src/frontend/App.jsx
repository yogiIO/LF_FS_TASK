import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { SessionProvider } from './context/SessionContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import FeedPage from './pages/FeedPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route element={<AppLayout />}>
                                <Route path="/" element={<FeedPage />} />
                                <Route path="/trending" element={<TrendingPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route
                                    path="/profile"
                                    element={(
                                        <ProtectedRoute>
                                            <ProfilePage />
                                        </ProtectedRoute>
                                    )}
                                />
                            </Route>
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}

export default App;
