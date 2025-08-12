# RUSH Chat - Render.com Deployment Guide

## Prerequisites
1. GitHub account with your code pushed
2. Render.com account (free tier available)
3. MongoDB Atlas account (free tier available)

## Step 1: Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write access
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist all IP addresses (0.0.0.0/0) for Render.com

## Step 2: Deploy to Render.com

### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Go to [Render.com Dashboard](https://dashboard.render.com/)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file
6. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (e.g., use a password generator)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Will be auto-set by Render

### Option B: Manual Setup
1. Go to [Render.com Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `rush-chat`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rushchat
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://your-app-name.onrender.com
   ```

6. Click "Create Web Service"

## Step 3: Update CORS Configuration
After deployment, update your `.env` file or Render environment variables:
- Set `FRONTEND_URL` to your actual Render.com URL (e.g., `https://rush-chat-abc123.onrender.com`)

## Step 4: Test Your Deployment
1. Wait for deployment to complete (5-10 minutes)
2. Visit your Render.com URL
3. Register a new account
4. Test chat functionality
5. Test profile photo upload

## Important Notes

### File Storage
- Profile photos are stored locally on Render.com
- **Important**: Render.com's free tier has ephemeral storage
- Photos will be deleted when the service restarts
- For production, consider using:
  - Cloudinary (recommended)
  - AWS S3
  - Google Cloud Storage

### Database
- Uses MongoDB Atlas for message and user storage
- Messages and user data persist across restarts
- Make sure to backup your database regularly

### Performance
- Free tier may have cold starts (first request slow)
- Consider upgrading to paid tier for production use

## Environment Variables Reference
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rushchat
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-app.onrender.com
PORT=5000
```

## Troubleshooting
- Check Render.com logs for errors
- Ensure MongoDB connection string is correct
- Verify all environment variables are set
- Check that your GitHub repository is public or properly connected

## Production Considerations
1. **File Storage**: Implement cloud storage for profile photos
2. **Database**: Consider MongoDB Atlas paid tier for better performance
3. **Security**: Use strong JWT secrets and regularly rotate them
4. **Monitoring**: Set up logging and monitoring
5. **Backups**: Regular database backups
6. **SSL**: Render.com provides HTTPS automatically