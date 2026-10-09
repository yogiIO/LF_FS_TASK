import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

function useSession() {
    const [currentUser, setCurrentUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await api.get('/profile');
                setCurrentUser(response.data.user);
            } catch {
                setCurrentUser(null);
            } finally {
                setAuthReady(true);
            }
        };
        restoreSession();
    }, []);

    const register = useCallback(async ({ username, email, password }) => {
        await api.post('/users', { username, email, password });
    }, []);

    const login = useCallback(async ({ email, password }) => {
        const response = await api.post('/login', { email, password });
        setCurrentUser(response.data.user);
        return response.data.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } finally {
            setCurrentUser(null);
        }
    }, []);

    return { currentUser, authReady, register, login, logout };
}

export default useSession;
