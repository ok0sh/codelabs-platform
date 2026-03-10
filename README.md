# CodeLabs - Live Collaborative Coding Platform

A professional-grade, real-time collaborative coding platform with video conferencing, live code editing, terminal sharing, and music playlist features.

## Features

### ✨ Core Features

- **Authentication System**: Secure user registration and login with JWT tokens
- **Professional Dashboard**: 
  - Real-time statistics and activity tracking
  - Task management
  - Quick links and help center
  - Room discovery and management
  
- **Live Coding Rooms**:
  - Real-time collaborative code editing with Monaco Editor
  - Support for multiple programming languages (JavaScript, Python, TypeScript, etc.)
  - Live terminal sharing
  - Synchronized code updates across all participants

- **Video Conferencing**:
  - Multi-participant video feeds
  - Audio/video controls (mute, camera toggle)
  - Screen sharing capability
  - Real-time participant presence

- **Communication**:
  - Real-time chat with message history
  - User presence indicators
  - Join/leave notifications

- **Music Playlist**:
  - Shared music player
  - Synchronized playback across all participants
  - Custom playlists
  - Playback controls

## Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **Socket.io**: Real-time bidirectional communication
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Zustand**: State management
- **Socket.io Client**: Real-time updates
- **Monaco Editor**: Code editor (VS Code's editor)
- **Framer Motion**: Animations
- **Axios**: HTTP client
- **Lucide React**: Icon library

## Project Structure

```
codelabs-platform/
├── server/
│   ├── index.js              # Server entry point
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Room.js           # Room schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── rooms.js          # Room management routes
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── socket/
│   │   └── handlers.js       # Socket.io event handlers
│   └── .env.example          # Environment variables template
│
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles
│   │   ├── index.js          # React entry point
│   │   ├── pages/
│   │   │   ├── Login.js      # Login/signup page
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   └── LiveRoom.js   # Live coding room
│   │   ├── components/
│   │   │   └── CreateRoomModal.js
│   │   └── store/
│   │       ├── authStore.js  # Authentication state
│   │       └── roomStore.js  # Room state
│   └── .env.example          # Environment variables template
│
└── package.json              # Root package.json
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Install root dependencies
npm run install-all

# Or manually:
npm install
cd client && npm install
```

### Step 2: Set Up Environment Variables

**Server (.env in root directory):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codelabs
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=http://localhost:3000
```

**Client (.env in client directory):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Start MongoDB

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service:
sudo systemctl start mongodb
```

### Step 4: Run the Application

**Development Mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage Guide

### 1. Creating an Account

1. Navigate to http://localhost:3000
2. Click "Sign Up" 
3. Enter username, email, and password
4. Click "Sign Up" to create your account

### 2. Logging In

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### 3. Creating a Coding Room

1. From the dashboard, click "Create Room"
2. Fill in:
   - Room name
   - Description (optional)
   - Room type (Public/Private)
   - Max participants
   - Enabled features (Code, Video, Music)
3. Click "Create Room"

### 4. Joining a Room

1. Browse available rooms in the dashboard
2. Click "Join Room" on any active room
3. You'll enter the live coding environment

### 5. Using the Live Room

**Code Editor:**
- Write code collaboratively in real-time
- Select programming language from dropdown
- All changes sync instantly with other participants

**Terminal:**
- Share terminal commands
- View command history
- Execute commands visible to all

**Video Feeds:**
- Toggle video with camera button
- Mute/unmute audio with mic button
- View up to 3 participants simultaneously

**Chat:**
- Send messages to all participants
- View message history
- Real-time delivery

**Music Player:**
- Control shared playlist
- Play/pause for everyone
- Skip tracks
- Add songs to playlist

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Rooms
- `POST /api/rooms/create` - Create new room
- `GET /api/rooms/active` - Get all active rooms
- `GET /api/rooms/:roomId` - Get specific room
- `POST /api/rooms/:roomId/join` - Join a room
- `POST /api/rooms/:roomId/leave` - Leave a room
- `PUT /api/rooms/:roomId/playlist` - Update room playlist

## Socket Events

### Client → Server
- `join-room` - Join a coding room
- `leave-room` - Leave a coding room
- `code-change` - Send code update
- `terminal-command` - Send terminal command
- `chat-message` - Send chat message
- `music-control` - Control music playback
- `toggle-media` - Toggle audio/video

### Server → Client
- `room-users` - Current room participants
- `user-joined` - New user joined
- `user-left` - User left room
- `code-update` - Code changed by peer
- `terminal-output` - Terminal command from peer
- `chat-message` - New chat message
- `music-update` - Music playback update
- `playlist-changed` - Playlist updated

## Design Features

### Visual Design
- **Futuristic Theme**: Dark blue cosmic background with animated effects
- **Typography**: Orbitron for headings, JetBrains Mono for code
- **Color Scheme**: 
  - Primary: Cyan (#00d9ff)
  - Secondary: Blue (#0099ff)
  - Background: Dark navy (#0a0e27)
- **Glassmorphism**: Frosted glass card effects
- **Animations**: Smooth transitions and micro-interactions

### UI/UX Features
- Responsive design for all screen sizes
- Smooth page transitions
- Real-time presence indicators
- Toast notifications for user actions
- Loading states and error handling
- Accessible form controls

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/` and socket handlers in `server/socket/handlers.js`
2. **Frontend**: Create components in `client/src/components/` and pages in `client/src/pages/`
3. **State**: Update stores in `client/src/store/` for state management

### Testing

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test
```

## Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub

### Frontend Deployment (Vercel/Netlify)

1. Build the client: `cd client && npm run build`
2. Deploy `build` folder
3. Set environment variables

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default: 27017)

### Socket Connection Failed
- Check SOCKET_URL matches server port
- Verify CORS settings in server
- Ensure both server and client are running

### Video/Audio Not Working
- Grant browser permissions for camera/microphone
- Check WebRTC compatibility
- Verify secure context (HTTPS in production)

## Future Enhancements

- [ ] WebRTC video/audio implementation
- [ ] File sharing and upload
- [ ] Code execution and preview
- [ ] Whiteboard for diagrams
- [ ] Screen recording
- [ ] Room persistence and history
- [ ] User profiles and avatars
- [ ] Advanced permissions system
- [ ] Mobile app version

## License

MIT License - feel free to use for your projects!

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@codelabs.dev

## Credits

Built with ❤️ using modern web technologies.

---

**CodeLabs** - Building the future of collaborative coding
