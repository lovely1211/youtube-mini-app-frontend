# YouTube Mini App

This is a mini application that integrates with the YouTube API to fetch video details, update video titles, add comments, and track event logs. The application supports Google authentication and allows users to interact with their uploaded YouTube videos.

## Features
- Google OAuth login/logout
- Fetch details of an uploaded video
- Add comments to the video
- Update the title of the video
- Delete comments
- Store all event logs in the database

## Tech Stack
- **Frontend**: React.js, Context API, React Router
- **Backend**: Node.js, Express.js, Mongo Atlas
- **Authentication**: Passport.js (Google OAuth)
- **Deployment**: Vercel (frontend), Render (backend)

## API Endpoints

### Authentication
- `GET /auth/google` - Initiates Google authentication
- `GET /auth/callback` - Handles Google authentication callback
- `GET /logout` - Logs out the user

### Videos
- `GET /api/videos/:videoId` - Fetch video details
- `PUT /api/videos/:videoId` - Update video title

### Comments
- `POST /api/comments` - Add a comment
- `DELETE /api/comments/:commentId` - Delete a comment

### Logs
- Logs are automatically created for each event and stored in the database

## Database Schema

### Videos Collection
```json
{
  "_id": "ObjectId",
  "videoId": "string",
  "title": "string",
  "description": "string",
  "publishedAt": "date"
}
```

### Comments Collection
```json
{
  "_id": "ObjectId",
  "videoId": "string",
  "commentId": "string",
  "text": "string",
  "author": "string",
  "timestamp": "date"
}
```

### Logs Collection
```json
{
  "_id": "ObjectId",
  "event": "string",
  "videoId": "string",
  "timestamp": "date",
  "details": "object"
}
```

## Setup Instructions

1. Clone the repository for frontend:
   ```bash
   git clone https://github.com/lovely1211/youtube-mini-app-frontend
   ```
2. Clone the repository for backend:
   ```bash
   git clone https://github.com/lovely1211/youtube-mini-app-backend
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables in `.env` file:
   ```env
   CLIENT_ID=<Your Google Client ID>
   CLIENT_SECRET=<Your Google Client Secret>
   YOUTUBE_API_KEY=<Your YouTube API Key>
   MONGO_URI=<Your MongoDB Connection String>
   PORT=5000
   SESSION_SECRET=<Your session secret key>
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

6. Start the frontend server:
   ```bash
   npm start
   ```

## Deployment
- Deploy the backend on Render -  **https://youtube-mini-app-backend.onrender.com**
- Deploy the frontend on Vercel  -  **https://youtube-mini-app-frontend.vercel.app/**

## Usage
1. Log in using Google OAuth.
2. Fetch video details.
3. Add or delete comments.
4. Update the video title.
5. View logs for events.

## Author
Developed by [Lovely Singh]
