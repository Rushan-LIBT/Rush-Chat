import React from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import AuthContainer from './components/AuthContainer';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import WelcomeScreen from './components/WelcomeScreen';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      dark: '#4f46e5',
      light: '#a5b4fc',
    },
    secondary: {
      main: '#10b981', // Success green
    },
    background: {
      default: '#0f172a', // Slate-900
      paper: '#1e293b', // Slate-800
    },
    text: {
      primary: '#f8fafc', // Slate-50
      secondary: '#94a3b8', // Slate-400
    },
    success: {
      main: '#10b981', // Emerald-500
    },
    warning: {
      main: '#f59e0b', // Amber-500
    },
    error: {
      main: '#ef4444', // Red-500
    },
    info: {
      main: '#3b82f6', // Blue-500
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f172a',
        },
      },
    },
  },
});

const ChatApp: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedUser, isOnline } = useChat();

  if (!currentUser) {
    return <AuthContainer />;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      {/* Network Status Indicator */}
      <Box
        className={isOnline ? 'online-indicator' : 'offline-indicator'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          py: 1,
          px: 2,
          borderRadius: 2,
          fontSize: '0.75rem',
          fontWeight: 600,
          bgcolor: isOnline ? 'success.main' : 'error.main',
          color: 'white',
          animation: 'slideInUp 0.3s ease-out',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'white',
            animation: isOnline ? 'pulse 2s infinite' : 'none',
          }}
        />
        {isOnline ? 'Online' : 'Offline'}
      </Box>

      <Sidebar />
      {selectedUser ? <ChatWindow /> : <WelcomeScreen />}
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <ChatProvider>
          <ChatApp />
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
