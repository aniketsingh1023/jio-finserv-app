/**
 * Token Storage Utilities
 * Handle JWT token persistence with AsyncStorage / SecureStore
 */

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';

/**
 * Save authentication token securely
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
    throw new Error('Failed to save authentication token');
  }
};

/**
 * Retrieve saved authentication token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token || null;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
    throw new Error('Failed to remove authentication token');
  }
};

/**
 * Check if token exists
 */
export const hasToken = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};
