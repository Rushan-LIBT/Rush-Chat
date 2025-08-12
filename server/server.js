const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS configuration for separate frontend deployment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://rush-chat-dashboard.onrender.com',
        process.env.FRONTEND_URL || 'https://rush-chat-dashboard.onrender.com',
        // Allow any onrender.com subdomain for now
        /^https:\/\/.*\.onrender\.com$/
      ]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Temporary additional CORS headers for debugging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rush-chat-dashboard.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('server/uploads'));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/conversations'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rush Chat API Server', 
    status: 'healthy',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});