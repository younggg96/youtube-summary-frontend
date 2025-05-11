import { useState } from 'react';
import { VideoInfo } from '../types';
import { Calendar, Eye, ThumbsUp, Clock, ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite } from '../api/authApi';

interface VideoCardProps {
  video: VideoInfo;
  onSummarize: (video: VideoInfo) => void;
  compact?: boolean;
  isFavorite?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onSummarize, 
  compact = false,
  isFavorite: initialIsFavorite = false
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format number (add thousands separator)
  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Open video in new tab
  const openVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (video.url) {
      window.open(video.url, '_blank');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // If not logged in, redirect to login page
      window.location.href = '/auth';
      return;
    }
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        await removeFavorite(video.id);
      } else {
        await addFavorite(video.id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex bg-gray-800/40 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-all">
        <div 
          className="w-36 h-20 flex-shrink-0 cursor-pointer" 
          onClick={openVideo}
        >
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-2 flex-grow overflow-hidden">
          <h3 
            className="text-sm font-medium text-white truncate cursor-pointer hover:text-blue-400"
            onClick={openVideo}
          >
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{formatDate(video.publishedAt)}</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onSummarize(video)}
              className="text-xs px-2 py-1 bg-red-600/70 hover:bg-red-500 text-white rounded transition-colors"
            >
              Summarize
            </button>
            <button
              onClick={openVideo}
              className="text-xs px-2 py-1 bg-gray-600/70 hover:bg-gray-500 text-white rounded transition-colors flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Watch
            </button>
            {isAuthenticated && (
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`text-xs p-1 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-red-300'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all">
      <div className="aspect-video cursor-pointer" onClick={openVideo}>
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 
            className="text-lg font-medium text-white line-clamp-2 cursor-pointer hover:text-blue-400 flex-1"
            onClick={openVideo}
          >
            {video.title}
          </h3>
          {isAuthenticated && (
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`p-1 rounded-full transition-colors ml-2 flex-shrink-0 ${
                isFavorite ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-red-300'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        <p className="text-sm text-gray-400 mt-2">{video.channel}</p>
        
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-300">
          {video.publishedAt && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(video.publishedAt)}
            </div>
          )}
          {video.viewCount !== undefined && (
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatNumber(video.viewCount)} views
            </div>
          )}
          {video.likeCount !== undefined && (
            <div className="flex items-center">
              <ThumbsUp className="w-3 h-3 mr-1" />
              {formatNumber(video.likeCount)}
            </div>
          )}
          {video.duration && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {video.duration}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSummarize(video)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            Summarize
          </button>
          <button
            onClick={openVideo}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Watch
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard; 