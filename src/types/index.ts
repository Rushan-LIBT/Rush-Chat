export interface User {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  createdAt?: Date;
  senderUsername?: string;
  receiverUsername?: string;
  senderAvatar?: string;
  receiverAvatar?: string;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

export interface Conversation {
  conversationId: string;
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  uploadAvatar: (file: File) => Promise<{ success: boolean; message: string; avatar?: string }>;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}