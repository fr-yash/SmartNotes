# 🚀 Deployment Guide - Smart Notes

This guide covers deploying Smart Notes to production with proper API configuration for both development and production environments.

## 📋 Environment Configuration

### Development Environment
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API URL**: `http://localhost:5000/api` (from `.env`)

### Production Environment
- **Frontend**: Your deployed frontend domain (e.g., `https://smartnotes.vercel.app`)
- **Backend**: Your deployed backend domain (e.g., `https://smartnotes-api.herokuapp.com`)
- **API URL**: `/api` (relative path - same domain as frontend)

## 🔧 Configuration Files

### Frontend Configuration

#### `.env` (Development)
```
VITE_API_URL=http://localhost:5000/api
```

#### `.env.production` (Production)
```
VITE_API_URL=/api
```

**How it works:**
- During development: Uses explicit localhost URL
- During production build: Uses relative `/api` path
- Vite automatically selects the correct `.env` file based on build mode

### Backend Configuration

#### `.env` (Development & Production)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GENAI_MODEL=gemini-2.0-flash
CORS_ORIGIN=* (development) or your_frontend_domain (production)
```

## 🌐 Deployment Options

### Option 1: Same Domain Deployment (Recommended)
Deploy both frontend and backend on the same domain using a reverse proxy.

**Example with Nginx:**
```nginx
server {
    listen 80;
    server_name smartnotes.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Benefits:**
- ✅ No CORS issues
- ✅ Relative `/api` path works perfectly
- ✅ Simpler configuration
- ✅ Better security

### Option 2: Separate Domains with CORS
Deploy frontend and backend on different domains.

**Backend `.env`:**
```
CORS_ORIGIN=https://smartnotes.vercel.app
```

**Frontend `.env.production`:**
```
VITE_API_URL=https://smartnotes-api.herokuapp.com/api
```

**Benefits:**
- ✅ Independent scaling
- ✅ Separate deployments
- ⚠️ Requires CORS configuration

### Option 3: Vercel + Render (Popular Combination)

**Frontend (Vercel):**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   VITE_API_URL=/api
   ```
4. Deploy

**Backend (Render):**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CORS_ORIGIN=https://your-vercel-domain.vercel.app
   ```
4. Deploy

**Vercel Rewrite (vercel.json):**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-render-backend.onrender.com/api/:path*"
    }
  ]
}
```

## 📝 Step-by-Step Deployment

### 1. Prepare for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm install --production
```

### 2. Set Environment Variables

**Backend Production `.env`:**
```
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GENAI_MODEL=gemini-2.0-flash
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Deploy Backend

**Using Render:**
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

**Using Heroku:**
```bash
heroku create smartnotes-api
git push heroku main
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
```

### 4. Deploy Frontend

**Using Vercel:**
1. Connect GitHub repository
2. Set environment variables
3. Deploy

**Using Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Set `CORS_ORIGIN` to your specific frontend domain (not `*`)
- [ ] Enable HTTPS on both frontend and backend
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting on backend
- [ ] Use strong passwords for all services

## 🧪 Testing Production Build Locally

```bash
# Build frontend
cd frontend
npm run build

# Serve production build
npm run preview

# In another terminal, start backend
cd backend
npm start
```

Visit `http://localhost:4173` to test the production build locally.

## 🐛 Troubleshooting

### Issue: 404 errors on API calls
**Solution:**
- Check CORS_ORIGIN in backend .env
- Verify API_BASE_URL in frontend
- Check reverse proxy configuration

### Issue: CORS errors
**Solution:**
- Update CORS_ORIGIN to match frontend domain
- Ensure credentials are properly configured
- Check browser console for specific error

### Issue: Admin dashboard not loading
**Solution:**
- Verify user has admin role in database
- Check API endpoints are accessible
- Verify JWT token is valid
- Check browser console for errors

## 📞 Support

For deployment issues:
1. Check backend logs: `heroku logs --tail` or `render logs`
2. Check frontend build: `npm run build`
3. Verify environment variables are set
4. Test API endpoints with Postman

---

**Note**: The application is now configured to work seamlessly in both development and production environments!

