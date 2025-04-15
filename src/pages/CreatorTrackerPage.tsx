import { useState } from 'react';
import { SearchIcon, Loader2, User2 } from 'lucide-react';
import { searchCreator, getCreatorVideos, generateSummary } from '../api/youtubeApi';
import { Creator, VideoInfo } from '../types';
import CreatorCard from '../components/CreatorCard';
import VideoCard from '../components/VideoCard';

const CreatorTrackerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizedVideo, setSummarizedVideo] = useState<VideoInfo | null>(null);

  // Search creators
  const handleSearchCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setCreators([]);
    setSelectedCreator(null);
    setVideos([]);
    setSummary('');
    setSummarizedVideo(null);

    try {
      const results = await searchCreator(searchQuery);
      setCreators(results);
      if (results.length === 0) {
        setError('No creators found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching creators:', error);
      setError('Failed to search creators. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // View creator videos
  const handleViewCreatorVideos = async (creator: Creator) => {
    setLoading(true);
    setSelectedCreator(creator);
    setVideos([]);
    setError('');
    setSummary('');
    setSummarizedVideo(null);

    try {
      const videos = await getCreatorVideos(creator.id);
      setVideos(videos);
      if (videos.length === 0) {
        setError('No videos found for this creator.');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch creator videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate video summary
  const handleSummarizeVideo = async (video: VideoInfo) => {
    setLoading(true);
    setSummary('');
    setError('');
    setSummarizedVideo(video);

    try {
      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      const { summary } = await generateSummary(videoUrl);
      setSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
          YouTube Creator Tracker
        </h1>
        <p className="mt-2 text-xl text-gray-300">
          Search and summarize YouTube creators' videos
        </p>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearchCreator} className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter YouTube creator name"
              className="pl-10 pr-4 py-3 w-full border-2 border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <SearchIcon className="h-5 w-5 mr-1" />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl backdrop-blur-xl">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {loading && !selectedCreator && (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-300">Searching for creators...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {creators.length > 0 && !selectedCreator && 
          creators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onViewVideos={handleViewCreatorVideos} 
            />
          ))
        }
      </div>

      {selectedCreator && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-700 sticky top-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 mr-4">
                  <img 
                    src={selectedCreator.profilePicture || 'https://via.placeholder.com/100?text=Creator'} 
                    alt={selectedCreator.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCreator.name}</h2>
                  {selectedCreator.subscriberCount && (
                    <p className="text-sm text-gray-400">
                      {selectedCreator.subscriberCount.toLocaleString()} subscribers
                    </p>
                  )}
                </div>
              </div>
              
              {selectedCreator.description && (
                <p className="text-sm text-gray-300 mb-4">{selectedCreator.description}</p>
              )}
              
              <button
                onClick={() => {
                  setSelectedCreator(null);
                  setVideos([]);
                  setSummary('');
                  setSummarizedVideo(null);
                }}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center mt-4"
              >
                Back to Creator Search
              </button>
              
              {summarizedVideo && summary && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                    Video Summary
                  </h3>
                  <div className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-xl border border-gray-600">
                    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">{summary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {loading && selectedCreator && (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
                <p className="mt-4 text-lg text-gray-300">Loading videos...</p>
              </div>
            )}
            
            <div className="space-y-4">
              {videos.map(video => (
                <VideoCard 
                  key={video.id}
                  video={video}
                  onSummarize={handleSummarizeVideo}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorTrackerPage; 