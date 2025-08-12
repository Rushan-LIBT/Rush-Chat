import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Message } from '@mui/icons-material';

const WelcomeScreen: React.FC = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#111827',
        color: '#94a3b8',
        p: 4,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
        <Avatar
          sx={{
            width: 128,
            height: 128,
            bgcolor: '#1e293b',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Message sx={{ fontSize: 64, color: '#6366f1' }} />
        </Avatar>
        
        <Typography
          variant="h3"
          component="h2"
          sx={{
            color: '#f8fafc',
            fontWeight: 300,
            mb: 2,
          }}
        >
          RUSH Chat
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: '#94a3b8',
            mb: 1,
            fontWeight: 400,
          }}
        >
          Your conversations will appear on the left.
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#94a3b8',
            mb: 4,
          }}
        >
          Click the message icon to search for users and start new conversations.
        </Typography>
        
        <Paper
          sx={{
            p: 3,
            bgcolor: '#1e293b',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#94a3b8' }}
          >
            💬 <Box component="strong" sx={{ color: '#f8fafc' }}>Quick Start:</Box> Click the message icon (💬) in the sidebar header to search for users and start new conversations!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;