import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Badge,
} from '@mui/material';
import {
  Send,
  MoreVert,
  Search,
  Phone,
  Videocam,
  Delete,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { getImageUrl } from '../utils/imageUrl';

const ChatWindow: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedUser, currentMessages, sendMessage, deleteConversation } = useChat();
  const [message, setMessage] = useState('');

  if (!selectedUser) {
    return null; // This will show the WelcomeScreen instead
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const success = await sendMessage(message.trim());
    if (success) {
      setMessage('');
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedUser) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete this conversation with ${selectedUser.username}? This action cannot be undone.`);
    if (confirmed) {
      await deleteConversation(selectedUser.id);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#111827',
        height: '100vh',
      }}
    >
      <Paper
        sx={{
          p: 2,
          bgcolor: '#1e293b',
          borderRadius: 0,
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: selectedUser.isOnline ? '#10b981' : 'transparent',
                width: 12,
                height: 12,
                border: '2px solid #1e293b',
              },
            }}
          >
            <Avatar
              src={getImageUrl(selectedUser.avatar)}
              sx={{
                bgcolor: '#6366f1',
                width: 40,
                height: 40,
              }}
            >
              {!selectedUser.avatar && selectedUser.username.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 500 }}>
              {selectedUser.username}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {selectedUser.isOnline ? 'online' : 'offline'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#374151' } }}>
            <Videocam />
          </IconButton>
          <IconButton sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#374151' } }}>
            <Phone />
          </IconButton>
          <IconButton sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#374151' } }}>
            <Search />
          </IconButton>
          <IconButton 
            onClick={handleDeleteConversation}
            sx={{ 
              color: '#ef4444', 
              '&:hover': { bgcolor: '#374151' } 
            }}
            title="Delete conversation"
          >
            <Delete />
          </IconButton>
          <IconButton sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#374151' } }}>
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {currentMessages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          const senderAvatar = isOwn ? msg.senderAvatar : msg.senderAvatar;
          return (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: 1,
              }}
            >
              {!isOwn && (
                <Avatar
                  src={getImageUrl(senderAvatar)}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: '#6366f1',
                    fontSize: '0.75rem',
                  }}
                >
                  {!senderAvatar && msg.senderUsername?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Paper
                sx={{
                  maxWidth: { xs: '70%', md: '60%' },
                  p: 1.5,
                  bgcolor: isOwn ? '#6366f1' : '#1e293b',
                  color: isOwn ? 'white' : '#f8fafc',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {msg.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isOwn ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                    display: 'block',
                    textAlign: 'right',
                  }}
                >
                  {formatTime(new Date(msg.createdAt || msg.timestamp))}
                </Typography>
              </Paper>
              {isOwn && (
                <Avatar
                  src={getImageUrl(senderAvatar)}
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: '#6366f1',
                    fontSize: '0.75rem',
                  }}
                >
                  {!senderAvatar && msg.senderUsername?.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </Box>
          );
        })}
      </Box>

      <Paper
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          bgcolor: '#1e293b',
          borderRadius: 0,
          borderTop: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#374151',
              color: '#f8fafc',
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                bgcolor: '#374151',
              },
              '&.Mui-focused': {
                bgcolor: '#374151',
                '& fieldset': {
                  borderColor: '#6366f1',
                },
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#94a3b8',
              opacity: 1,
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            bgcolor: '#6366f1',
            color: 'white',
            '&:hover': {
              bgcolor: '#4f46e5',
            },
          }}
        >
          <Send />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatWindow;