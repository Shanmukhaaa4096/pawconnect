import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken, getAuthToken } from '../services/api';
import { joinUserRoom } from '../services/socket';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  demoLogin: (role: UserRole) => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          joinUserRoom(res.user._id);
        } catch (err) {
          console.warn('Session expired, logging out');
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
    joinUserRoom(res.user._id);
  };

  const register = async (data: Partial<User> & { password: string }) => {
    const res = await api.register(data);
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
    joinUserRoom(res.user._id);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const demoLogin = async (role: UserRole) => {
    let email = 'adopter@pawconnect.org';
    if (role === 'shelter') email = 'shelter@pawconnect.org';
    if (role === 'admin') email = 'admin@pawconnect.org';

    await login({ email, password: 'password123' });
  };

  const updateUser = async (updatedData: Partial<User>) => {
    const res = await api.updateProfile(updatedData);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
