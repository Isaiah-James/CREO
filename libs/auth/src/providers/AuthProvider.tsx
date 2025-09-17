'use client';
import React, { createContext, useCallback, useState } from 'react';
import { User } from '@creo/api-types';

export interface IAuthContext {
  user: User | null;

  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  register(username: string, email: string, password: string): Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface Props {
  children: React.ReactNode;
  user: User | null
}

export function AuthProvider({ children, user: initialUser }: Props) {
  const [user, setUser] = useState<User | null>(initialUser);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) setUser(await res.json() as User);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout');
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
