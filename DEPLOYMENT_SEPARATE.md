# Rush Chat - Separate Backend & Frontend Deployment Guide

## Architecture Overview

**Backend (API Server):**
- Node.js + Express API
- MongoDB Atlas database
- File uploads handling
- Deployed as Render Web Service

**Frontend (React App):**
- React + TypeScript + Vite
- Static site served from CDN
- Deployed as Render Static Site

---

## Backend Deployment

### 1. Deploy Backend API

1. **Create new Web Service on Render**
   - Repository: Your GitHub repo
   - Name: `rush-chat-api`
   - Runtime: `Node`

2. **Configuration:**
   ```yaml
   Build Command: npm install
   Start Command: node server/server.js
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://rushan:rushan1234@cluster0.sluz1rc.mongodb.net/Chat?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=[auto-generated]
   FRONTEND_URL=https://rush-chat-frontend.onrender.com
   ```

4. **Or use Blueprint:**
   - Upload `render-backend.yaml`
   - Render will auto-configure

### 2. Backend URLs
- **API Base:** `https://rush-chat-api.onrender.com`
- **Health Check:** `https://rush-chat-api.onrender.com/`
- **Auth Endpoints:** `https://rush-chat-api.onrender.com/api/auth/*`
- **Chat Endpoints:** `https://rush-chat-api.onrender.com/api/*`

---

## Frontend Deployment

### 1. Deploy Frontend Static Site

1. **Create new Static Site on Render**
   - Repository: Your GitHub repo
   - Name: `rush-chat-frontend`

2. **Configuration:**
   ```yaml
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Environment Variables:**
   ```
   VITE_API_URL=https://rush-chat-api.onrender.com/api
   ```

4. **Or use Blueprint:**
   - Upload `render-frontend.yaml`
   - Render will auto-configure

### 2. Frontend URL
- **App:** `https://rush-chat-frontend.onrender.com`

---

## Deployment Steps

### Option A: Using Blueprints (Recommended)

1. **Deploy Backend:**
   ```bash
   # Upload render-backend.yaml to Render
   # Or create Web Service manually with above settings
   ```

2. **Deploy Frontend:**
   ```bash
   # Upload render-frontend.yaml to Render  
   # Or create Static Site manually with above settings
   ```

### Option B: Manual Deployment

1. **Backend Service:**
   - Go to Render Dashboard
   - New → Web Service
   - Connect GitHub repo
   - Configure as above

2. **Frontend Service:**
   - Go to Render Dashboard
   - New → Static Site
   - Connect GitHub repo
   - Configure as above

---

## Configuration Files Created

1. **`render-backend.yaml`** - Backend web service config
2. **`render-frontend.yaml`** - Frontend static site config
3. **Updated `src/services/api.ts`** - API URL configuration
4. **Updated `src/utils/imageUrl.ts`** - Image URL handling
5. **Updated `server/server.js`** - CORS for separate domains

---

## Benefits of Separate Deployment

### ✅ **Advantages:**
- **Independent Scaling:** Scale backend and frontend separately
- **Better Performance:** Frontend served from global CDN
- **Development Flexibility:** Deploy frontend/backend independently
- **Cost Optimization:** Frontend static hosting is free
- **Better Caching:** Static assets cached globally

### ⚠️ **Considerations:**
- **CORS Configuration:** Properly configured for cross-origin requests
- **Environment Variables:** Different configs for each service
- **Deployment Coordination:** Need to deploy both services

---

## URLs Summary

| Service | Type | URL | Purpose |
|---------|------|-----|---------|
| Backend | Web Service | `https://rush-chat-api.onrender.com` | API endpoints |
| Frontend | Static Site | `https://rush-chat-frontend.onrender.com` | React app |

---

## Testing

1. **Backend Health:** Visit `https://rush-chat-api.onrender.com`
2. **Frontend App:** Visit `https://rush-chat-frontend.onrender.com`
3. **API Integration:** Frontend should connect to backend automatically

Your separate deployments are now ready! 🚀