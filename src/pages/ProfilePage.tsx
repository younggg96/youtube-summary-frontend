import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFavorites } from '../api/authApi';
import { getCreatorVideos } from '../api/youtubeApi';
import { VideoInfo, UpdateUserRequest, ResetPasswordRequest } from '../types';
import { Loader2, Heart, LogOut, Key, Save, X, Edit2 } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, updateProfile, resetPassword } = useAuth();
  const [favoriteVideos, setFavoriteVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [profileData, setProfileData] = useState<UpdateUserRequest>({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState<ResetPasswordRequest>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const navigate = useNavigate();

  // Initialize user profile form
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get list of favorite video IDs
        const favoriteIds = await getFavorites();
        
        // If no favorites, return immediately
        if (favoriteIds.length === 0) {
          setFavoriteVideos([]);
          return;
        }

        // We need to get video info based on actual implementation
        // In a real scenario, you might need a dedicated API to fetch video details
        // For demonstration purposes, we're using the getCreatorVideos API as a mock
        const mockVideos = await getCreatorVideos('MKBHD');
        
        // Only keep favorited videos
        const favorites = mockVideos.filter(video => favoriteIds.includes(video.id));
        
        setFavoriteVideos(favorites);
      } catch (err) {
        console.error(err);
        setError('Failed to load favorite videos');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully');
      setShowProfileEdit(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await resetPassword(passwordData);
      setSuccessMessage('Password reset successfully');
      setShowPasswordReset(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSummarizeVideo = (video: VideoInfo) => {
    // Save selected video to localStorage and navigate to home page
    localStorage.setItem('selected_video_url', video.url || '');
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Already redirected to login page
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
          Your Profile
        </h1>
        <p className="mt-2 text-xl text-gray-300">
          Manage your account and favorite videos
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-6 max-w-lg mx-auto">
          <p className="text-green-200 text-center">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700 sticky top-4">
            <div className="flex flex-col items-center mb-6">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-24 h-24 rounded-full mb-4 border-2 border-red-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center mb-4 text-xl font-bold text-white">
                  {getInitials(user.username)}
                </div>
              )}
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>

            <div className="space-y-4">
              <button 
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => {
                  setShowProfileEdit(true);
                  setShowPasswordReset(false);
                }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              
              <button 
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => {
                  setShowPasswordReset(true);
                  setShowProfileEdit(false);
                }}
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </button>
              
              <button 
                className="w-full px-4 py-2 bg-red-600/70 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content area - shows favorite videos or account settings forms based on state */}
        <div className="lg:col-span-2">
          {showProfileEdit ? (
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                  Edit Profile
                </h2>
                <button 
                  onClick={() => setShowProfileEdit(false)}
                  className="p-2 hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : showPasswordReset ? (
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                  Change Password
                </h2>
                <button 
                  onClick={() => setShowPasswordReset(false)}
                  className="p-2 hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-6">
                Your Favorite Videos
              </h2>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
                  <p className="mt-4 text-lg text-gray-300">Loading your favorites...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                  <p className="text-red-200">{error}</p>
                  <button 
                    className="mt-2 px-4 py-1 bg-red-700 hover:bg-red-600 text-white rounded-md text-sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : favoriteVideos.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-lg text-gray-400">You haven't added any favorites yet</p>
                  <button 
                    className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
                    onClick={() => navigate('/')}
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {favoriteVideos.map(video => (
                    <VideoCard 
                      key={video.id}
                      video={video}
                      onSummarize={handleSummarizeVideo}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 