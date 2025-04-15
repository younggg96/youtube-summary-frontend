import React, { useState } from 'react';
import { Send, Youtube as YouTubeIcon, Loader2 } from 'lucide-react';

// 定义API端点
const API_URL = '/api/summarize';

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoInfo, setVideoInfo] = useState<{
    title?: string;
    channel?: string;
    thumbnail?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');
    setVideoInfo({});

    try {
      // 调用实际的后端API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: url }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await response.json();
      
      setSummary(data.summary);
      
      // 如果API返回了视频信息，存储它
      if (data.title) setVideoInfo(prev => ({ ...prev, title: data.title }));
      if (data.channel) setVideoInfo(prev => ({ ...prev, channel: data.channel }));
      if (data.thumbnail) setVideoInfo(prev => ({ ...prev, thumbnail: data.thumbnail }));
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate summary. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gray-900 rounded-full p-4">
                <YouTubeIcon className="h-16 w-16 text-red-500" />
              </div>
            </div>
            <h1 className="mt-6 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
              YouTube Summarizer
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Transform any YouTube video into a concise summary with AI-powered analysis
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-lg font-medium text-gray-300 mb-2">
                  Enter YouTube URL
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <YouTubeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="block w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    pattern="^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border-0 rounded-xl text-lg font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Video...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-xl backdrop-blur-xl">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {loading && (
              <div className="mt-6 flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
                <p className="mt-4 text-lg text-gray-300">Processing video content...</p>
                <p className="text-sm text-gray-400">This may take a minute for longer videos</p>
              </div>
            )}

            {summary && (
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                  Video Summary
                </h2>

                {videoInfo.thumbnail && (
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img 
                      src={videoInfo.thumbnail} 
                      alt="Video thumbnail" 
                      className="w-full object-cover"
                    />
                  </div>
                )}

                {videoInfo.title && (
                  <h3 className="text-xl font-bold text-white mb-1">{videoInfo.title}</h3>
                )}

                {videoInfo.channel && (
                  <p className="text-gray-400 mb-4">Channel: {videoInfo.channel}</p>
                )}

                <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-xl border border-gray-600">
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;