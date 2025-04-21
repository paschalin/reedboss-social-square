
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('reedboss_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log('🔍 Login Attempt:', { 
        username: username.trim(), 
        passwordLength: password.length 
      });
      
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password 
        }),
      });
      
      console.log('🌐 Response Status:', response.status);
      
      const data = await response.json();
      
      console.log('📦 Response Data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.token) {
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          token: data.token,
        };
        setUser(userData);
        localStorage.setItem('reedboss_user', JSON.stringify(userData));
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('🚨 Login Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reedboss_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
