import React, { useRef } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  ExitToApp,
  Message,
  Refresh,
  CameraAlt,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { getImageUrl } from '../utils/imageUrl';
import ChatList from './ChatList';

const Sidebar: React.FC = () => {
  const { currentUser, logout, uploadAvatar } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    refreshConversations, 
    isLoadingConversations, 
    showSearch, 
    setShowSearch 
  } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    const confirmed = window.confirm(`Are you sure you want to logout, ${currentUser?.username}?`);
    if (confirmed) {
      await logout();
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await uploadAvatar(file);
        if (result.success) {
          console.log('Avatar uploaded successfully');
        } else {
          alert(`Failed to upload photo: ${result.message}`);
        }
      } catch (error) {
        alert('Failed to upload photo');
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        height: '100vh',
        bgcolor: '#0f172a',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        sx={{
          p: 2,
          bgcolor: '#1e293b',
          borderRadius: 0,
          borderBottom: '1px solid #334155',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={getImageUrl(currentUser?.avatar)}
                sx={{
                  bgcolor: '#6366f1',
                  width: 40,
                  height: 40,
                }}
              >
                {!currentUser?.avatar && currentUser?.username.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                onClick={handleAvatarUpload}
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  bgcolor: '#6366f1',
                  color: 'white',
                  width: 20,
                  height: 20,
                  '&:hover': {
                    bgcolor: '#4f46e5',
                  },
                }}
              >
                <CameraAlt sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: '#f8fafc', fontWeight: 500 }}
            >
              {currentUser?.username}
            </Typography>
          </Box>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={refreshConversations}
              disabled={isLoadingConversations}
              sx={{
                color: '#94a3b8',
                '&:hover': { bgcolor: '#374151' },
              }}
              title="Refresh conversations"
            >
              <Refresh />
            </IconButton>
            <IconButton
              onClick={() => setShowSearch(!showSearch)}
              sx={{
                color: showSearch ? '#6366f1' : '#94a3b8',
                '&:hover': { bgcolor: '#374151' },
              }}
              title="Start new chat"
            >
              <Message />
            </IconButton>
            <IconButton
              onClick={handleLogout}
              sx={{
                color: '#ef4444',
                '&:hover': { bgcolor: '#374151' },
              }}
              title="Logout"
            >
              <ExitToApp />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ p: 1.5, bgcolor: '#0f172a' }}>
        <TextField
          fullWidth
          placeholder={showSearch ? "Search users to start new chat" : "Click message icon to search"}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!showSearch && e.target.value) {
              setShowSearch(true);
            }
          }}
          onFocus={() => setShowSearch(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1e293b',
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
      </Box>

      <ChatList />
    </Box>
  );
};

export default Sidebar;