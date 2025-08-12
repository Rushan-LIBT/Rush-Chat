import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Conversation, Message } from '../types';
import { chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  selectedUser: User | null;
  searchQuery: string;
  searchResults: User[];
  currentMessages: Message[];
  isLoadingConversations: boolean;
  isSearching: boolean;
  showSearch: boolean;
  selectUser: (user: User) => void;
  setSearchQuery: (query: string) => void;
  setShowSearch: (show: boolean) => void;
  sendMessage: (content: string) => Promise<boolean>;
  refreshConversations: () => Promise<void>;
  deleteConversation: (otherUserId: string) => Promise<boolean>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { currentUser } = useAuth();

  const fetchConversations = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoadingConversations(true);
      const response = await chatAPI.getConversations(currentUser.id);
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!currentUser) return;
    
    try {
      setIsSearching(true);
      const response = await chatAPI.searchUsers(currentUser.id, query);
      if (response.success) {
        setSearchResults(response.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    if (!currentUser) return;
    
    try {
      const response = await chatAPI.getMessages(currentUser.id, otherUserId);
      if (response.success) {
        setCurrentMessages(response.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const refreshConversations = async () => {
    await fetchConversations();
  };

  const deleteConversation = async (otherUserId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const response = await chatAPI.deleteConversation(currentUser.id, otherUserId);
      if (response.success) {
        // Clear current messages if this conversation is selected
        if (selectedUser?.id === otherUserId) {
          setCurrentMessages([]);
          setSelectedUser(null);
        }
        // Refresh conversations to update the list
        await fetchConversations();
        return true;
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
    return false;
  };

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setShowSearch(false);
    await loadMessages(user.id);
  };

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!currentUser || !selectedUser || !content.trim()) return false;
    
    try {
      const response = await chatAPI.sendMessage(currentUser.id, selectedUser.id, content.trim());
      
      if (response.success) {
        setCurrentMessages(prev => [...prev, response.message]);
        // Refresh conversations to update last message
        await fetchConversations();
        return true;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    return false;
  };

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, currentUser]);

  // Fetch conversations when component mounts and user is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      fetchConversations();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

  const value = {
    conversations,
    selectedUser,
    searchQuery,
    searchResults,
    currentMessages,
    isLoadingConversations,
    isSearching,
    showSearch,
    selectUser,
    setSearchQuery,
    setShowSearch,
    sendMessage,
    refreshConversations,
    deleteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};