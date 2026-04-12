/**
 * Auth Store (using React Context + Hooks)
 * Centralized authentication state management
 * 
 * Can be easily migrated to Zustand by installing: npm install zustand
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as authService from '../services/auth.service';
import * as tokenStorage from '../utils/storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  // State
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: AuthUser; token: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Wrap your app with this to provide auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Login action
   */
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login({ email, password });
      await tokenStorage.saveToken(response.token);
      dispatch({
        type: 'SET_USER',
        payload: { user: response.user, token: response.token },
      });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Login failed',
      });
      throw error;
    }
  }, []);

  /**
   * Signup action
   */
  const signup = useCallback(
    async (email: string, password: string, name: string, phone?: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const response = await authService.signup({ email, password, name, phone });
        await tokenStorage.saveToken(response.token);
        dispatch({
          type: 'SET_USER',
          payload: { user: response.user, token: response.token },
        });
      } catch (error: any) {
        dispatch({
          type: 'SET_ERROR',
          payload: error.message || 'Signup failed',
        });
        throw error;
      }
    },
    []
  );

  /**
   * Logout action
   */
  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await tokenStorage.removeToken();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  /**
   * Restore session from stored token
   * Call this on app startup
   */
  const restoreSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = await tokenStorage.getToken();
      if (token) {
        // In a real app, you'd verify the token by calling an endpoint
        // For now, we just restore the token
        dispatch({
          type: 'SET_USER',
          payload: {
            token,
            user: {
              id: '',
              email: '',
              name: '',
              phone: null,
              createdAt: '',
              updatedAt: '',
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    isAuthenticated: !!state.user && !!state.token,
    login,
    signup,
    logout,
    restoreSession,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
