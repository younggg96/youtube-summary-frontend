import { Creator } from '../types';
import { Users, Film } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onViewVideos: (creator: Creator) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onViewVideos }) => {
  // Format number (add thousands separator)
  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const defaultProfilePic = 'https://via.placeholder.com/100?text=Creator';
  
  return (
    <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all p-4">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 mr-4">
          <img 
            src={creator.profilePicture || defaultProfilePic} 
            alt={creator.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">{creator.name}</h3>
          
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-300">
            {creator.subscriberCount !== undefined && (
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {formatNumber(creator.subscriberCount)} subscribers
              </div>
            )}
            {creator.videoCount !== undefined && (
              <div className="flex items-center">
                <Film className="w-3 h-3 mr-1" />
                {formatNumber(creator.videoCount)} videos
              </div>
            )}
          </div>
        </div>
      </div>
      
      {creator.description && (
        <p className="text-sm text-gray-400 mt-3 line-clamp-2">{creator.description}</p>
      )}
      
      <button
        onClick={() => onViewVideos(creator)}
        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-colors flex items-center justify-center"
      >
        View Videos
      </button>
    </div>
  );
};

export default CreatorCard; 