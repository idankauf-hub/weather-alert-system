import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../lib/auth';

type AuthState = { token: string | null; user: AuthUser | null };
type AuthCtx = AuthState & {
    ready: boolean;
    setAuth: (next: AuthState) => void;
    clearAuth: () => void;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const Ctx = createContext<AuthCtx | null>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('auth');
            if (saved) {
                const obj = JSON.parse(saved) as AuthState;
                if (obj?.token) { setToken(obj.token); setUser(obj.user); }
            }
        } finally {
            setReady(true);
        }
    }, []);

    const setAuth = (next: AuthState) => {
        setToken(next.token);
        setUser(next.user);
        localStorage.setItem('auth', JSON.stringify(next));
    };

    const clearAuth = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth');
    };

    const authFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
        const headers = new Headers(init.headers || {});
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return fetch(input, { ...init, headers });
    };

    const value = useMemo(() => ({ token, user, ready, setAuth, clearAuth, authFetch }), [token, user, ready]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
