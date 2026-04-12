
import { post, get, put } from './api';

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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  gender?: string | null;
  dob?: string | null;
  address?: string | null;
  city?: string | null;
  pincode?: string | null;
  createdAt: string;
  updatedAt: string;
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

/**
 * Get current user profile (requires authentication)
 */
export const getCurrentUserProfile = async (): Promise<{ message: string; user: UserProfile }> => {
  return get<{ message: string; user: UserProfile }>('/api/users/me');
};

/**
 * Update current user profile (requires authentication)
 */
export const updateUserProfile = async (data: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> => {
  return put<{ message: string; user: UserProfile }>('/api/users/me', data);
};

