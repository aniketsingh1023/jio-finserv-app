

import { post } from './api';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  return post<AuthResponse>('/api/auth/signup', data);
};

/**
 * Log in an existing user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return post<AuthResponse>('/api/auth/login', data);
};
