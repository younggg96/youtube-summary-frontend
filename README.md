# YouTube Summarizer

A React-based tool for generating summaries of YouTube videos.

## Project Structure

- `frontend/`: React frontend application
- `supabase/functions/`: Serverless functions

## Development Environment Setup

### Prerequisites

1. Node.js (v16+)
2. npm or yarn
3. Supabase CLI (for serverless functions)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-summarizer.git
   cd youtube-summarizer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser to http://localhost:3000

## Features

- Search for YouTube videos
- Generate summaries using AI
- Track favorite creators
- User authentication
- Save and manage favorite videos

## API Integration

The application connects to a Python FastAPI backend that handles:
- YouTube data retrieval
- Video summarization
- User management
- Authentication

## Deployment

### Production Build

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Platforms

- Vercel (frontend)
- Supabase (backend functions and database)
- Render, Fly.io or Railway (API server)

## License

MIT 