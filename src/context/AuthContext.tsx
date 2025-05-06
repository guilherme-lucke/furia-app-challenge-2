
import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, lgpdConsent: boolean) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock authentication
    // In a real app, this would call an auth API
    setUser({ id: `user-${Date.now()}`, email });
  };

  const signup = async (email: string, password: string, lgpdConsent: boolean) => {
    if (!lgpdConsent) {
      throw new Error('É necessário concordar com os termos da LGPD para criar uma conta.');
    }
    
    // Mock registration
    // In a real app, this would call an auth API
    setUser({ id: `user-${Date.now()}`, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
