import { createContext, useContext, useState, useEffect, useCallback, FC, ReactNode } from 'react';
import apiClient from '../utils/api';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt-token'));
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const logout = useCallback(async () => {
    try {
      await apiClient.post('auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }, []);

  const login = async (credentials: any) => {
    try {
      console.log("DEBUG: AuthContext -> login() called for:", credentials.username);
      const response = await apiClient.post('auth/login', credentials);
      
      console.log("DEBUG: AuthContext -> login() Success! Status:", response.status);
      console.log("DEBUG: AuthContext -> response.data:", response.data);

      const { token, user } = response.data;
      
      if (token && typeof token === 'string') {
        console.log("DEBUG: AuthContext -> Setting token in state and localStorage:", token.substring(0, 10) + "...");
        setToken(token);
        setUser(user);
        localStorage.setItem('jwt-token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log("DEBUG: AuthContext -> token verified in localStorage:", localStorage.getItem('jwt-token') ? "YES" : "NO");
      } else {
        console.error("DEBUG: AuthContext -> No valid token string in response data!");
      }
      
      setLastActivity(Date.now());
    } catch (error: any) {
      console.error("DEBUG: AuthContext -> login() FAILED!");
      if (error.response) {
        console.error("DEBUG: Error Response Status:", error.response.status);
        console.error("DEBUG: Error Response Data:", error.response.data);
      } else {
        console.error("DEBUG: Network or unexpected error:", error.message);
      }
      throw error;
    }
  };

  // On mount, try to recover user from localStorage and set up global listener
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    const handleAuthExpired = () => {
      console.warn("AuthContext -> Session expired event received");
      logout();
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, [logout]);

  // Session timeout: 5 minutes idle
  useEffect(() => {
    if (!token) return;

    const timeout = 5 * 60 * 1000; // 5 minutes
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        console.warn("AuthContext -> Session idle timeout. Logging out...");
        logout();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [token, lastActivity, logout]);

  // Separate effect for activity listeners to avoid re-running the interval logic too often
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
