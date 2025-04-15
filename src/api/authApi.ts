import { User, LoginCredentials, RegisterCredentials, AuthResponse, UpdateUserRequest, ResetPasswordRequest } from '../types';
import api, { authFetch } from './apiClient';

// User login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return api.auth.login(credentials);
}

// User registration
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return api.users.register(credentials);
}

// Get current logged-in user
export async function getCurrentUser(): Promise<User | null> {
  if (!api.getToken()) {
    return null;
  }
  
  try {
    return await api.users.getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Logout
export function logout(): void {
  api.auth.logout();
}

// Update user profile
export async function updateUserProfile(userData: UpdateUserRequest): Promise<User> {
  return api.users.updateUser(userData);
}

// Reset password
export async function resetPassword(passwordData: ResetPasswordRequest): Promise<{ message: string }> {
  // Convert our frontend password format to the backend format
  const updateData: UpdateUserRequest = {
    password: passwordData.new_password,
  };
  
  // Update user with new password
  await api.users.updateUser(updateData);
  
  return { message: 'Password reset successfully' };
}

// Add video to favorites
export async function addFavorite(videoId: string): Promise<User> {
  // This endpoint needs to be implemented in the backend
  return authFetch<User>('/users/me/favorites', {
    method: 'POST',
    body: JSON.stringify({ video_id: videoId }),
  });
}

// Remove video from favorites
export async function removeFavorite(videoId: string): Promise<User> {
  // This endpoint needs to be implemented in the backend
  return authFetch<User>(`/users/me/favorites/${videoId}`, {
    method: 'DELETE',
  });
}

// Get favorite videos
export async function getFavorites(): Promise<string[]> {
  try {
    const user = await getCurrentUser();
    return user?.favorites || [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
} 