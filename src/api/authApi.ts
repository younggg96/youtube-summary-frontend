import { User, LoginCredentials, RegisterCredentials, AuthResponse, UpdateUserRequest, ResetPasswordRequest } from '../types';

const BASE_API_URL = 'http://localhost:8000';

// User login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem('auth_token', data.token);
  
  return data;
}

// User registration
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem('auth_token', data.token);
  
  return data;
}

// Get current logged-in user
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch(`${BASE_API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Logout
export function logout(): void {
  localStorage.removeItem('auth_token');
}

// Update user profile
export async function updateUserProfile(userData: UpdateUserRequest): Promise<User> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${BASE_API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return await response.json();
}

// Reset password
export async function resetPassword(passwordData: ResetPasswordRequest): Promise<{ message: string }> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${BASE_API_URL}/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }

  return await response.json();
}

// Add video to favorites
export async function addFavorite(videoId: string): Promise<User> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${BASE_API_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ video_id: videoId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }

  return await response.json();
}

// Remove video from favorites
export async function removeFavorite(videoId: string): Promise<User> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${BASE_API_URL}/favorites/${videoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }

  return await response.json();
}

// Get favorite videos
export async function getFavorites(): Promise<string[]> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return [];
  }
  
  const response = await fetch(`${BASE_API_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get favorites');
  }

  const data = await response.json();
  return data.favorites || [];
} 