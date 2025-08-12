import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Badge,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send,
  MoreVert,
  Search,
  Phone,
  Videocam,
  Delete,
  Done,
  DoneAll,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { getImageUrl } from '../utils/imageUrl';

const ChatWindow: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedUser, currentMessages, sendMessage, deleteConversation, refreshMessages } = useChat();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Auto-refresh messages every 3 seconds when chat is open
  useEffect(() => {
    if (selectedUser && refreshMessages) {
      refreshIntervalRef.current = setInterval(() => {
        refreshMessages();
      }, 3000);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [selectedUser, refreshMessages]);

  if (!selectedUser) {
    return null; // This will show the WelcomeScreen instead
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const success = await sendMessage(message.trim());
      if (success) {
        setMessage('');
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSending(false);
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
        {currentMessages.map((msg, index) => {
          const isOwn = msg.senderId === currentUser?.id;
          const senderAvatar = isOwn ? msg.senderAvatar : msg.senderAvatar;
          const isLastMessage = index === currentMessages.length - 1;
          
          return (
            <Fade in={true} timeout={300} key={msg.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 1,
                  mb: isLastMessage ? 2 : 0,
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
                    position: 'relative',
                    animation: isLastMessage ? 'slideInUp 0.3s ease-out' : 'none',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {msg.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isOwn ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                      }}
                    >
                      {formatTime(new Date(msg.createdAt || msg.timestamp))}
                    </Typography>
                    {isOwn && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {msg.isRead ? (
                          <DoneAll sx={{ fontSize: 14, color: '#10b981' }} />
                        ) : (
                          <Done sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
                        )}
                      </Box>
                    )}
                  </Box>
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
            </Fade>
          );
        })}
        
        <div ref={messagesEndRef} />
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
          placeholder={isSending ? "Sending..." : "Type a message"}
          variant="outlined"
          size="small"
          disabled={isSending}
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
              '&.Mui-disabled': {
                bgcolor: '#374151',
                opacity: 0.7,
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
          disabled={isSending || !message.trim()}
          sx={{
            bgcolor: isSending || !message.trim() ? '#374151' : '#6366f1',
            color: 'white',
            '&:hover': {
              bgcolor: isSending || !message.trim() ? '#374151' : '#4f46e5',
            },
            '&.Mui-disabled': {
              color: '#94a3b8',
            },
          }}
        >
          {isSending ? <CircularProgress size={20} color="inherit" /> : <Send />}
        </IconButton>
      </Paper>

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;