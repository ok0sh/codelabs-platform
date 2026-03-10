# CodeLabs - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites Check
```bash
node --version  # Should be v16+
mongod --version  # Should be v5+
```

### 2. Quick Setup
```bash
# Install all dependencies
npm run install-all

# Create environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env and add your MongoDB URI and JWT secret
# Edit client/.env if needed (defaults should work)
```

### 3. Start MongoDB
```bash
# Option 1: Direct command
mongod

# Option 2: As a service
sudo systemctl start mongodb

# Option 3: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Launch the App
```bash
# Start both server and client
npm run dev

# Or run separately in different terminals:
npm run server  # Terminal 1
npm run client  # Terminal 2
```

### 5. Access the Platform
- Open browser to: http://localhost:3000
- Create an account
- Start coding together!

## 🎯 First Time User Flow

1. **Sign Up**: Create your account at the login page
2. **Dashboard**: View your personalized dashboard
3. **Create Room**: Click "Create Room" and fill in details
4. **Start Coding**: Enter the live room and start collaborating!

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Server only
npm run server

# Client only (in client directory)
cd client && npm start

# Build for production
cd client && npm run build
```

## 📝 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codelabs
JWT_SECRET=change-this-to-a-random-string
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Not Starting
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

## 🎨 Features to Try

1. **Code Editor**: Try different languages from the dropdown
2. **Terminal**: Share commands with your team
3. **Video**: Toggle your camera and microphone
4. **Chat**: Send messages to participants
5. **Music**: Control the shared playlist

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Explore the API endpoints
- Customize the design in CSS files
- Add new features to meet your needs

## 💡 Tips

- Use **Ctrl+S** to save code in the editor
- The terminal shows the last commands from all participants
- Music playback is synchronized across all users
- Rooms automatically close when the last participant leaves

---

Happy coding! 🎉
