import React, { createContext, useContext } from 'react';
import useSession from '../hooks/useSession';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
    const value = useSession();
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error('useAuth must be used within SessionProvider');
    }
    return ctx;
}
