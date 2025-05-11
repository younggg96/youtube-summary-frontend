import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  UpdateUserRequest,
  VideoSummary,
  ChannelResponse,
} from "../types";

// API base URL
const API_BASE_URL = "https://youtube-summary-backend-rscz.onrender.com/api";

// Token storage keys
const ACCESS_TOKEN_KEY = "auth_token";
const TOKEN_TYPE_KEY = "token_type";

// Get stored token
export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Get token type
export const getTokenType = (): string => {
  return localStorage.getItem(TOKEN_TYPE_KEY) || "bearer";
};

// Set auth tokens
export const setAuthTokens = (
  accessToken: string,
  tokenType: string = "bearer"
): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
};

// Clear auth tokens
export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
};

// Get auth header
export const getAuthHeader = (): HeadersInit => {
  const token = getToken();
  const tokenType = getTokenType();

  if (!token) {
    return {};
  }

  return {
    Authorization: `${tokenType} ${token}`,
  };
};

// General fetch function with auth
export const authFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Authentication API
export const auth = {
  // Login to get token
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();

    // Store tokens
    setAuthTokens(data.access_token, data.token_type);

    // Get current user info
    const user = await users.getCurrentUser();

    return {
      user,
      token: data.access_token,
    };
  },

  // Logout
  logout: (): void => {
    clearAuthTokens();
  },
};

// Users API
export const users = {
  // Register new user
  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      // Return the full error object as a JSON string for detailed error handling
      throw new Error(JSON.stringify(error));
    }

    // After registration, login the user
    return auth.login({
      username: userData.username,
      password: userData.password,
    });
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    return authFetch<User>("/users/me");
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    return authFetch<User[]>("/users");
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<User> => {
    return authFetch<User>(`/users/${userId}`);
  },

  // Update user info
  updateUser: async (userData: UpdateUserRequest): Promise<User> => {
    return authFetch<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  },

  // Delete user account
  deleteUser: async (): Promise<void> => {
    return authFetch<void>("/users/me", {
      method: "DELETE",
    });
  },
};

// Video summary API
export const summaries = {
  // Generate video summary
  generateSummary: async (
    videoUrl: string,
    keepAudio: boolean = false
  ): Promise<VideoSummary> => {
    return authFetch<VideoSummary>("/videos/summarize", {
      method: "POST",
      body: JSON.stringify({
        video_url: videoUrl,
        keep_audio: keepAudio,
      }),
    });
  },

  // Get all summaries
  getAllSummaries: async (
    skip: number = 0,
    limit: number = 100
  ): Promise<VideoSummary[]> => {
    console.log("skip", skip);
    console.log("limit", limit);
    return authFetch<VideoSummary[]>("/videos/");
  },

  // Get user's summaries
  getMySummaries: async (
    skip: number = 0,
    limit: number = 100
  ): Promise<VideoSummary[]> => {
    console.log("skip", skip);
    console.log("limit", limit);
    return authFetch<VideoSummary[]>("/videos/my");
  },

  // Get summary by ID
  getSummaryById: async (summaryId: string): Promise<VideoSummary> => {
    return authFetch<VideoSummary>(`/videos/${summaryId}`);
  },

  // Delete summary
  deleteSummary: async (summaryId: string): Promise<void> => {
    return authFetch<void>(`/videos/${summaryId}`, {
      method: "DELETE",
    });
  },
};

// YouTube API
export const youtube = {
  // Search channel videos
  searchChannelVideos: async (
    channelName: string,
    maxResults: number = 20
  ): Promise<ChannelResponse> => {
    return authFetch<ChannelResponse>("/videos/search_channel", {
      method: "POST",
      body: JSON.stringify({
        channel_name: channelName,
        max_results: maxResults,
      }),
    });
  },
};

export default {
  auth,
  users,
  summaries,
  youtube,
  getToken,
  getAuthHeader,
};
