import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, UpdateUserRequest, ResetPasswordRequest } from '../types';
import { 
  login as apiLogin, 
  register as apiRegister, 
  getCurrentUser, 
  logout as apiLogout,
  updateUserProfile as apiUpdateProfile,
  resetPassword as apiResetPassword
} from '../api/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateUserRequest) => Promise<void>;
  resetPassword: (passwordData: ResetPasswordRequest) => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in when component loads
    const checkAuthentication = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
        setError('Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await apiLogin(credentials);
      setUser(user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await apiRegister(credentials);
      setUser(user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const updateProfile = async (userData: UpdateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await apiUpdateProfile(userData);
      setUser(updatedUser);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (passwordData: ResetPasswordRequest) => {
    try {
      setLoading(true);
      setError(null);
      await apiResetPassword(passwordData);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 