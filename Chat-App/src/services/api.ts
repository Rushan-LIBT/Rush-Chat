import axios from 'axios';

// Use same domain in production, localhost in development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Production: same domain
  : 'http://localhost:5000/api';  // Development: localhost

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  logout: async (userId: string) => {
    const response = await api.post('/auth/logout', { userId });
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  uploadAvatar: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post(`/auth/upload-avatar/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const chatAPI = {
  getConversations: async (userId: string) => {
    const response = await api.get(`/conversations/${userId}`);
    return response.data;
  },

  getMessages: async (userId: string, otherUserId: string) => {
    const response = await api.get(`/messages/${userId}/${otherUserId}`);
    return response.data;
  },

  sendMessage: async (senderId: string, receiverId: string, content: string) => {
    const response = await api.post('/messages', {
      senderId,
      receiverId,
      content,
    });
    return response.data;
  },

  searchUsers: async (userId: string, query?: string) => {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    const response = await api.get(`/search-users/${userId}${params}`);
    return response.data;
  },

  deleteConversation: async (userId: string, otherUserId: string) => {
    const response = await api.delete(`/conversation/${userId}/${otherUserId}`);
    return response.data;
  },
};

export default api;