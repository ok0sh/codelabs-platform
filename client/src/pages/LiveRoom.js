import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import {
  Code2, Users, MessageSquare, Music, Mic, MicOff, Video, VideoOff,
  PhoneOff, Play, Pause, SkipForward, Send, Plus, Settings,
  ChevronLeft, Bell, Search, CheckCircle, Camera
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import toast from 'react-hot-toast';
import './LiveRoom.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function LiveRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { currentRoom, fetchRoom, leaveRoom } = useRoomStore();

  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [code, setCode] = useState('// Start coding together...\n\n');
  const [language, setLanguage] = useState('javascript');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: '~/my-project > npm start' }
  ]);
  const [playlist, setPlaylist] = useState([
    { id: '1', title: 'Nightwave', artist: 'Digital Horizon', duration: 208, current: 123 },
    { id: '2', title: 'Drifting Away', artist: 'The Mindight', duration: 195, current: 0 },
    { id: '3', title: 'Code Flow', artist: 'Chill Synths', duration: 242, current: 0 }
  ]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  const messagesEndRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (!user || !roomId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit('join-room', {
      roomId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar
    });

    newSocket.on('room-users', ({ participants: roomParticipants }) => {
      setParticipants(roomParticipants);
    });

    newSocket.on('user-joined', ({ username, participants: roomParticipants }) => {
      setParticipants(roomParticipants);
      toast.success(`${username} joined`);
    });

    newSocket.on('user-left', ({ username, participants: roomParticipants }) => {
      setParticipants(roomParticipants);
      toast(`${username} left`, { icon: '👋' });
    });

    newSocket.on('code-update', ({ code: newCode }) => {
      setCode(newCode);
    });

    newSocket.on('chat-message', ({ message, username, avatar, timestamp }) => {
      setMessages(prev => [...prev, { message, username, avatar, timestamp }]);
    });

    return () => {
      newSocket.emit('leave-room', { roomId });
      newSocket.disconnect();
    };
  }, [user, roomId]);

  useEffect(() => {
    if (token && roomId) {
      fetchRoom(token, roomId);
    }
  }, [token, roomId, fetchRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket?.emit('code-change', { roomId, code: value, language });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    socket.emit('chat-message', {
      roomId,
      message: newMessage,
      username: user.username,
      avatar: user.avatar
    });
    setNewMessage('');
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    setTerminalHistory(prev => [...prev, { type: 'command', text: `> ${terminalInput}` }]);
    setTerminalInput('');
  };

  const handleLeaveRoom = async () => {
    socket?.emit('leave-room', { roomId });
    await leaveRoom(token, roomId);
    navigate('/dashboard');
    toast.success('Left room');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user || !currentRoom) {
    return <div className="loading-screen"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="live-room-page">
      <div className="cosmic-bg"></div>

      <div className="room-header glass-card">
        <div className="header-left">
          <button className="back-btn" onClick={handleLeaveRoom}>
            <ChevronLeft size={20} />
          </button>
          <div className="room-title-section">
            <Code2 size={24} />
            <div>
              <h1>{currentRoom.name}</h1>
              <div className="room-status">
                <span className="status-indicator"></span>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="participants-preview">
            {participants.slice(0, 3).map((p, i) => (
              <div key={p.socketId} className="participant-avatar" style={{ zIndex: 3 - i }}>
                <img src={p.avatar} alt={p.username} />
              </div>
            ))}
            {participants.length > 3 && (
              <div className="participant-count">+{participants.length - 3}</div>
            )}
            <span>{participants.length}</span>
          </div>
        </div>

        <div className="header-right">
          <div className="room-time">37:24</div>
          <button className="icon-btn"><Bell size={20} /></button>
          <button className="icon-btn"><Settings size={20} /></button>
        </div>
      </div>

      <div className="room-layout">
        <div className="participants-sidebar glass-card">
          <div className="search-bar-small">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>

          <div className="participants-section">
            <div className="section-title">
              <Users size={16} />
              <span>Participants</span>
              <button><Plus size={14} /></button>
            </div>

            <div className="participants-list">
              {participants.map((p) => (
                <div key={p.socketId} className="participant-item">
                  <img src={p.avatar} alt={p.username} />
                  <span>{p.username}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="music-player">
            <div className="now-playing">
              <div className="album-art">
                <div className="sound-wave">
                  {[1,2,3,4].map(i => <div key={i} className="bar"></div>)}
                </div>
              </div>
              <div>
                <div className="track-title">{playlist[currentTrack]?.title}</div>
                <div className="track-artist">{playlist[currentTrack]?.artist}</div>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{width: '50%'}}></div>
            </div>

            <div className="player-controls">
              <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button onClick={() => setCurrentTrack((currentTrack + 1) % playlist.length)}>
                <SkipForward size={16} />
              </button>
            </div>

            <div className="playlist">
              {playlist.map((track, idx) => (
                <div key={track.id} className={`playlist-item ${idx === currentTrack ? 'active' : ''}`}>
                  <Play size={12} />
                  <div>
                    <div className="track-name">{track.title}</div>
                    <div className="track-artist-small">{track.artist}</div>
                  </div>
                  <Plus size={14} />
                </div>
              ))}
            </div>
          </div>

          <button className="invite-btn">
            <Users size={16} />
            Invite
          </button>
        </div>

        <div className="main-content">
          <div className="video-grid glass-card">
            {[...participants.slice(0, 3), ...Array(3 - Math.min(participants.length, 3))].map((p, i) => (
              <div key={i} className="video-feed">
                {p ? (
                  <>
                    <img src={p.avatar} alt={p.username} />
                    <div className="video-name">{p.username}</div>
                  </>
                ) : (
                  <div className="empty-feed">
                    <Camera size={32} />
                  </div>
                )}
              </div>
            ))}
            <div className="participant-count-badge">55</div>
          </div>

          <div className="code-terminal-section">
            <div className="code-editor glass-card">
              <div className="editor-toolbar">
                <div className="toolbar-tabs">
                  <button className="active">
                    <Code2 size={16} />
                  </button>
                </div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <Editor
                height="100%"
                defaultLanguage={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>

            <div className="terminal glass-card">
              <div className="terminal-header">
                <span>Terminal</span>
              </div>
              <div className="terminal-body">
                {terminalHistory.map((line, i) => (
                  <div key={i} className={`terminal-line ${line.type}`}>{line.text}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>
              <form onSubmit={handleTerminalSubmit} className="terminal-input">
                <span className="prompt">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter command..."
                />
              </form>
            </div>
          </div>

          <div className="bottom-controls glass-card">
            <div className="media-controls">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button onClick={() => setIsVideoOn(!isVideoOn)}>
                {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button><Camera size={20} /></button>
              <button className="leave-btn" onClick={handleLeaveRoom}>
                <PhoneOff size={20} />
                Leave
              </button>
            </div>
          </div>
        </div>

        <div className="chat-sidebar glass-card">
          <div className="tabs">
            <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={18} />
              Chat
            </button>
            <button className={activeTab === 'music' ? 'active' : ''} onClick={() => setActiveTab('music')}>
              <Music size={18} />
              Music
            </button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="messages-container">
                {messages.map((msg, i) => (
                  <div key={i} className="message">
                    <img src={msg.avatar} alt={msg.username} className="message-avatar" />
                    <div>
                      <div className="message-header">
                        <span className="message-username">{msg.username}</span>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                />
                <button type="submit">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="music-tab-content">
              <p>Music controls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveRoom;
