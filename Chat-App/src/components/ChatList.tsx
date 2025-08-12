import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  CircularProgress,
} from '@mui/material';
import { useChat } from '../contexts/ChatContext';
import { getImageUrl } from '../utils/imageUrl';

const ChatList: React.FC = () => {
  const { 
    conversations, 
    selectedUser, 
    selectUser, 
    isLoadingConversations,
    showSearch,
    searchResults,
    isSearching,
    searchQuery
  } = useChat();

  const formatLastSeen = (lastSeen?: Date) => {
    if (!lastSeen) return 'offline';
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - new Date(lastSeen).getTime()) / 60000);
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  // Show search results when searching
  if (showSearch) {
    if (isSearching) {
      return (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4
        }}>
          <CircularProgress size={32} sx={{ color: '#6366f1' }} />
        </Box>
      );
    }

    if (searchQuery && searchResults.length === 0) {
      return (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            No users found for "{searchQuery}"
          </Typography>
        </Box>
      );
    }

    // Show search results
    return (
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {searchResults.map((user) => (
            <ListItem
              key={user.id}
              disablePadding
              sx={{
                borderBottom: '1px solid #334155',
              }}
            >
              <ListItemButton
                onClick={() => selectUser(user)}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#374151',
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: user.isOnline ? '#10b981' : 'transparent',
                        width: 12,
                        height: 12,
                        border: '2px solid #0f172a',
                      },
                    }}
                  >
                    <Avatar
                      src={getImageUrl(user.avatar)}
                      sx={{
                        bgcolor: '#6366f1',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {!user.avatar && (
                        <Typography variant="h6">
                          {user.username.charAt(0).toUpperCase()}
                        </Typography>
                      )}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#f8fafc',
                        fontWeight: 500,
                      }}
                    >
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                      }}
                    >
                      {user.isOnline ? 'Online' : 'Click to start chatting'}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }

  // Show conversations loading
  if (isLoadingConversations) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4
      }}>
        <CircularProgress size={32} sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  // Show empty conversations
  if (conversations.length === 0) {
    return (
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4,
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          No conversations yet. Use the search to find users and start chatting!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      <List sx={{ p: 0 }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.conversationId}
            disablePadding
            sx={{
              borderBottom: '1px solid #334155',
            }}
          >
            <ListItemButton
              selected={selectedUser?.id === conversation.otherUser.id}
              onClick={() => selectUser(conversation.otherUser)}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: '#374151',
                },
                '&.Mui-selected': {
                  bgcolor: '#374151',
                  '&:hover': {
                    bgcolor: '#374151',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: conversation.otherUser.isOnline ? '#10b981' : 'transparent',
                      width: 12,
                      height: 12,
                      border: '2px solid #0f172a',
                    },
                  }}
                >
                  <Avatar
                    src={getImageUrl(conversation.otherUser.avatar)}
                    sx={{
                      bgcolor: '#6366f1',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {!conversation.otherUser.avatar && (
                      <Typography variant="h6">
                        {conversation.otherUser.username.charAt(0).toUpperCase()}
                      </Typography>
                    )}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#f8fafc',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {conversation.otherUser.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94a3b8',
                        ml: 1,
                      }}
                    >
                      {formatLastSeen(conversation.lastMessage.createdAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {conversation.lastMessage.content}
                    </Typography>
                    {conversation.unreadCount > 0 && (
                      <Box
                        sx={{
                          bgcolor: '#10b981',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                          {conversation.unreadCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;