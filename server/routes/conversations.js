const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Get user's conversations (users they've chatted with)
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Fetching conversations for user:', userId);

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId', 'username isOnline lastSeen avatar')
    .populate('receiverId', 'username isOnline lastSeen avatar')
    .sort({ createdAt: -1 });

    console.log('Found messages:', messages.length);

    // Group by conversation and get latest message for each
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const conversationId = message.conversationId;
      
      if (!conversationMap.has(conversationId)) {
        // Determine the other user (not the current user)
        const otherUser = message.senderId._id.toString() === userId ? 
          message.receiverId : message.senderId;
        
        conversationMap.set(conversationId, {
          conversationId,
          otherUser: {
            id: otherUser._id,
            username: otherUser.username,
            isOnline: otherUser.isOnline,
            lastSeen: otherUser.lastSeen,
            avatar: otherUser.avatar
          },
          lastMessage: {
            id: message._id,
            senderId: message.senderId._id,
            receiverId: message.receiverId._id,
            content: message.content,
            createdAt: message.createdAt,
            isRead: message.isRead
          },
          unreadCount: 0
        });
      }
      
      // Count unread messages for this user
      if (message.receiverId._id.toString() === userId && !message.isRead) {
        conversationMap.get(conversationId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching conversations'
    });
  }
});

// Get messages for a specific conversation
router.get('/messages/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const conversationId = Message.generateConversationId(userId, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'username avatar')
      .populate('receiverId', 'username avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await Message.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true }
    );

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      senderId: msg.senderId._id,
      receiverId: msg.receiverId._id,
      content: msg.content,
      createdAt: msg.createdAt,
      timestamp: msg.createdAt, // For compatibility
      isRead: msg.isRead,
      senderUsername: msg.senderId.username,
      receiverUsername: msg.receiverId.username,
      senderAvatar: msg.senderId.avatar,
      receiverAvatar: msg.receiverId.avatar
    }));

    console.log('Returning', formattedMessages.length, 'messages for conversation:', conversationId);

    res.json({
      success: true,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    });
  }
});

// Send a new message
router.post('/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID, receiver ID, and content are required'
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Sender or receiver not found'
      });
    }

    const conversationId = Message.generateConversationId(senderId, receiverId);

    const message = new Message({
      senderId,
      receiverId,
      content: content.trim(),
      conversationId
    });

    const savedMessage = await message.save();
    
    // Populate the message with user details
    await savedMessage.populate(['senderId', 'receiverId'], 'username avatar');

    console.log('Message saved successfully:', savedMessage._id);

    res.status(201).json({
      success: true,
      message: {
        id: savedMessage._id,
        senderId: savedMessage.senderId._id,
        receiverId: savedMessage.receiverId._id,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
        isRead: savedMessage.isRead,
        senderUsername: savedMessage.senderId.username,
        receiverUsername: savedMessage.receiverId.username,
        senderAvatar: savedMessage.senderId.avatar,
        receiverAvatar: savedMessage.receiverId.avatar
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sending message'
    });
  }
});

// Delete a conversation (all messages between two users)
router.delete('/conversation/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    // Verify both users exist
    const [user, otherUser] = await Promise.all([
      User.findById(userId),
      User.findById(otherUserId)
    ]);

    if (!user || !otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const conversationId = Message.generateConversationId(userId, otherUserId);
    
    // Delete all messages in the conversation
    const deleteResult = await Message.deleteMany({ conversationId });
    
    console.log(`Deleted ${deleteResult.deletedCount} messages for conversation:`, conversationId);
    
    res.json({
      success: true,
      message: 'Conversation deleted successfully',
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting conversation'
    });
  }
});

// Search users (for starting new conversations)
router.get('/search-users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { q } = req.query; // search query

    let query = { _id: { $ne: userId } }; // Exclude current user
    
    if (q && q.trim()) {
      query.username = new RegExp(q.trim(), 'i'); // Case-insensitive search
    }

    const users = await User.find(query, '-password')
      .limit(20)
      .sort({ username: 1 });

    // Format users for frontend (convert _id to id)
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen
    }));

    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching users'
    });
  }
});

module.exports = router;