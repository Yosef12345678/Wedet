import { api, tokenStorage } from './api';
import { AuthUser } from './types';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const response = await api.post('/login', { email, password });
  const accessToken: string = response.data.token ?? response.data.accessToken;
  const refreshToken: string = response.data.refreshToken;

  if (!accessToken) {
    throw new Error('Login succeeded but no access token was returned');
  }

  tokenStorage.setTokens(accessToken, refreshToken);
  return { accessToken, refreshToken, user: response.data.user };
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post('/reset-password', { token, newPassword });
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get('/me');
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } finally {
    tokenStorage.clear();
  }
};
