# Streaming Platform Backend API

A comprehensive backend API system for a streaming platform with user management, channel creation, and viewer data tracking capabilities.

## Features

- User sign-up and authentication system with JWT
- Channel creation and management
- Stream creation, starting, and ending
- Viewer registration and tracking
- Chat message storage and retrieval
- Comprehensive statistics and analytics
- Auto-tagging keywords from transcripts

## Tech Stack

- Node.js with Express
- SQLite database
- JWT for authentication
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Channels

- `POST /api/channels` - Create a new channel
- `GET /api/channels` - Get all channels
- `GET /api/channels/my-channels` - Get user's channels
- `GET /api/channels/:id` - Get channel by ID
- `PUT /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel

### Streams

- `POST /api/streams` - Create a new stream
- `PUT /api/streams/:id/start` - Start a stream
- `PUT /api/streams/:id/end` - End a stream
- `GET /api/streams` - Get all streams
- `GET /api/streams/:id` - Get stream by ID
- `GET /api/streams/channel/:channelId` - Get streams by channel

### Viewers

- `POST /api/viewers` - Register a viewer
- `PUT /api/viewers/:id/leave` - Record viewer departure
- `GET /api/viewers/stream/:streamId` - Get viewers by stream
- `GET /api/viewers/stream/:streamId/count` - Get current viewers count

### Chat

- `POST /api/chat` - Create a chat message
- `GET /api/chat/stream/:streamId` - Get chat messages by stream

### Stats

- `GET /api/stats/viewers/:streamId` - Get viewer stats
- `GET /api/stats/chat/:streamId` - Get chat stats
- `GET /api/stats/mood/:streamId` - Get mood stats
- `GET /api/stats/keywords/:streamId` - Get keyword stats
- `GET /api/stats/stream/:streamId` - Get combined stats

## Database Schema

The system uses the following database tables:

- `users` - User accounts
- `channels` - Streaming channels
- `streams` - Live streams and VODs
- `viewers` - Viewer information
- `chat_messages` - Chat messages
- `mood_logs` - Streamer mood data
- `keywords` - Auto-tagged keywords

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.