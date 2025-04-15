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
  is_active?: boolean;
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

export interface ResetPasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface VideoSummary {
  id: string;
  user_id: string;
  video_url: string;
  video_id: string;
  title: string;
  thumbnail: string;
  channel: string;
  content: string;
  created_at: string;
  audio_url?: string;
}

export interface ChannelVideo {
  id: string;
  title: string;
  url: string;
  upload_date: string;
  duration: number;
  view_count: number;
  description: string;
  thumbnail: string;
}

export interface ChannelResponse {
  channel_name: string;
  video_count: number;
  videos: ChannelVideo[];
} 