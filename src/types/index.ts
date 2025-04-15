export interface VideoInfo {
  id: string;
  title: string;
  description?: string;
  channel: string;
  channelId: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: number;
  likeCount?: number;
  duration?: string;
  summary?: string;
  url?: string;
}

export interface Creator {
  id: string;
  name: string;
  profilePicture?: string;
  channelUrl: string;
  subscriberCount?: number;
  videoCount?: number;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  favorites?: string[]; // Favorite video IDs
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface ResetPasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
} 