import { VideoInfo, Creator, ChannelVideo, VideoSummary } from '../types';
import api from './apiClient';

// Generate video summary
export async function generateSummary(videoUrl: string): Promise<{ summary: string; videoInfo: Partial<VideoInfo> }> {
  try {
    const result = await api.summaries.generateSummary(videoUrl);
    
    // Transform the response to match the expected format
    return {
      summary: result.content,
      videoInfo: {
        title: result.title,
        channel: result.channel,
        thumbnail: result.thumbnail,
        id: result.video_id,
        url: result.video_url
      }
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

// Get creator information
export async function getCreatorInfo(channelId: string): Promise<Creator> {
  try {
    // First, get videos to extract creator info
    const response = await api.youtube.searchChannelVideos(channelId, 1);
    
    return {
      id: channelId,
      name: response.channel_name,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      videoCount: response.video_count,
    };
  } catch (error) {
    console.error('Error getting creator info:', error);
    throw new Error('Failed to get creator info');
  }
}

// Search creators by channel name
export async function searchCreator(query: string): Promise<Creator[]> {
  try {
    // Use the search channel endpoint to get information about the channel
    const channelData = await api.youtube.searchChannelVideos(query, 1);
    
    return [{
      id: query,
      name: channelData.channel_name,
      channelUrl: `https://www.youtube.com/c/${query}`,
      videoCount: channelData.video_count
    }];
  } catch (error) {
    console.error('Error searching creator:', error);
    return []; // Return empty array instead of throwing
  }
}

// Get creator's video list
export async function getCreatorVideos(channelId: string): Promise<VideoInfo[]> {
  try {
    const data = await api.youtube.searchChannelVideos(channelId);
    
    // Convert API response data to our VideoInfo format
    return data.videos.map((video: ChannelVideo) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      channel: data.channel_name,
      channelId: channelId,
      thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
      publishedAt: video.upload_date || new Date().toISOString(),
      viewCount: video.view_count,
      duration: formatDuration(video.duration),
      url: video.url
    }));
  } catch (error) {
    console.error('Error getting creator videos:', error);
    throw new Error('Failed to get creator videos');
  }
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

// Get list of user's summaries
export async function getMySummaries(): Promise<VideoSummary[]> {
  return api.summaries.getMySummaries();
}

// Get summary by ID
export async function getSummaryById(summaryId: string): Promise<VideoSummary> {
  return api.summaries.getSummaryById(summaryId);
}

// Delete summary
export async function deleteSummary(summaryId: string): Promise<void> {
  return api.summaries.deleteSummary(summaryId);
} 