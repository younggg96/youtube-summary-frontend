import { VideoInfo, Creator } from '../types';

// API endpoints
const BASE_API_URL = 'http://localhost:8000';

// Define API response video type
interface ApiVideoResponse {
  id: string;
  title: string;
  url: string;
  upload_date: string;
  duration: number;
  view_count: number;
  description: string;
}

interface ApiChannelResponse {
  channel_name: string;
  video_count: number;
  videos: ApiVideoResponse[];
}

// Generate video summary
export async function generateSummary(videoUrl: string): Promise<{ summary: string; videoInfo: Partial<VideoInfo> }> {
  const response = await fetch(`/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ video_url: videoUrl }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate summary');
  }

  const data = await response.json();
  
  return {
    summary: data.summary,
    videoInfo: {
      title: data.title,
      channel: data.channel,
      thumbnail: data.thumbnail,
    }
  };
}

// Get creator information
export async function getCreatorInfo(channelId: string): Promise<Creator> {
  const response = await fetch(`${BASE_API_URL}/creator-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel_id: channelId }),
  });

  if (!response.ok) {
    throw new Error('Failed to get creator info');
  }

  return await response.json();
}

// Search creators by channel name
export async function searchCreator(query: string): Promise<Creator[]> {
  // This only returns the searched channel as a creator
  return [{
    id: query,
    name: query,
    channelUrl: `https://www.youtube.com/c/${query}`,
  }];
}

// Get creator's video list
export async function getCreatorVideos(channelId: string): Promise<VideoInfo[]> {
  const response = await fetch(`${BASE_API_URL}/search_channel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      channel_name: channelId,
      max_results: 10 
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get creator videos');
  }

  const data = await response.json() as ApiChannelResponse;
  
  // Convert API response data to our VideoInfo format
  return data.videos.map((video: ApiVideoResponse) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    channel: data.channel_name,
    channelId: data.channel_name,
    thumbnail: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
    publishedAt: video.upload_date || new Date().toISOString(),
    viewCount: video.view_count,
    duration: formatDuration(video.duration),
    url: video.url
  }));
}

// Helper function: format duration
function formatDuration(seconds: number): string {
  if (!seconds) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
} 