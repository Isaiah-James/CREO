'use client'
import { createContext, useCallback, useState } from "react";

export interface IAuthContext {
    user: User;
    login(request: LoginRequest): void;
    register(request: RegisterRequest): void;
    logout(): void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface Props {
    initialUser?: User | null;
    children: React.ReactNode;
};

export function AuthProvider({ initialUser, children }: Props) {
    const [user, setUser] = useState<User | null>(initialUser);

    const login = useCallback((request: LoginRequest) => {
        
    }, [setUser]);

    const register = useCallback((request: RegisterRequest) => {

    }, [setUser]);

    const logout = useCallback(() => {

    }, [setUser]);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}