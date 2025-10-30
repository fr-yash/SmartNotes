# 🚀 Production Deployment Setup - Smart Notes

## Your Production Setup

- **Backend**: https://smartnotes-backend-jt93.onrender.com
- **Frontend**: (To be deployed - Vercel, Netlify, or similar)

## 📋 Current Configuration

### Backend (.env)
```
MONGO_URI=mongodb+srv://yashkushwaha756:G2u3sY7nlAUCS9aV@cluster0.tqrkjai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey123
PORT=5000
GEMINI_API_KEY=AIzaSyBwHSYhKwKfHLJhsKqE1w9tK0wKub4yOos
GENAI_MODEL=gemini-2.0-flash
CORS_ORIGIN=*
```

### Frontend (.env.production)
```
VITE_API_URL=https://smartnotes-backend-jt93.onrender.com/api
```

## 🔐 Security Recommendations

### 1. Update CORS_ORIGIN (Important!)
Once you know your frontend domain, update the backend `.env`:

```
# For Vercel frontend
CORS_ORIGIN=https://your-vercel-app.vercel.app

# For Netlify frontend
CORS_ORIGIN=https://your-netlify-app.netlify.app

# For multiple domains (comma-separated)
CORS_ORIGIN=https://smartnotes.com,https://www.smartnotes.com
```

Then redeploy the backend on Render.

### 2. Change JWT_SECRET
Generate a strong random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update in backend `.env` and redeploy.

### 3. Use Environment Variables on Render
1. Go to Render Dashboard
2. Select your backend service
3. Go to Environment
4. Update all variables:
   - CORS_ORIGIN: Your frontend domain
   - JWT_SECRET: Strong random secret
   - Keep other variables as is

## 🚀 Deploy Frontend to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production ready configuration"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory (or `frontend` if separate)
5. Environment Variables: (none needed - uses production .env)
6. Click Deploy

### Step 3: Verify Deployment
1. Vercel will provide your frontend URL
2. Update backend CORS_ORIGIN:
   ```
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
3. Redeploy backend on Render

## 🚀 Deploy Frontend to Netlify (Alternative)

### Step 1: Build Locally
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub:
1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy

### Step 3: Update Backend CORS
```
CORS_ORIGIN=https://your-netlify-app.netlify.app
```

## ✅ Verification Checklist

### Backend (Render)
- [ ] Service is running
- [ ] Environment variables are set
- [ ] CORS_ORIGIN matches frontend domain
- [ ] Test endpoint: `curl https://smartnotes-backend-jt93.onrender.com/`

### Frontend (Vercel/Netlify)
- [ ] Build successful
- [ ] Deployment complete
- [ ] Can access at your domain
- [ ] Admin dashboard loads

### Integration Test
1. Go to your frontend URL
2. Login with your credentials
3. Navigate to Admin Dashboard
4. Verify data loads (users, analytics, templates)
5. Test user management features

## 🧪 Testing Production

### Test API Endpoints
```bash
# Get analytics
curl https://smartnotes-backend-jt93.onrender.com/api/admin/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all users
curl https://smartnotes-backend-jt93.onrender.com/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Frontend
1. Open your frontend URL
2. Login
3. Create a note
4. Use AI features (summarize, quiz, etc.)
5. Access admin dashboard
6. Test export functionality

## 📊 Monitoring

### Backend Logs (Render)
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor for errors

### Frontend Errors (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. Check Web Vitals and errors

### Database (MongoDB Atlas)
1. Go to MongoDB Atlas
2. Select your cluster
3. Monitor connection count
4. Check query performance

## 🔄 Updating Production

### Update Backend
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys from GitHub
```

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel/Netlify auto-deploys from GitHub
```

## 🐛 Troubleshooting

### Admin Dashboard Shows 404 Errors
1. Check CORS_ORIGIN in backend .env
2. Verify frontend URL matches CORS_ORIGIN
3. Clear browser cache
4. Check browser console for errors

### Login Fails
1. Verify MongoDB connection
2. Check JWT_SECRET is set
3. Verify user exists in database
4. Check backend logs

### API Calls Timeout
1. Check backend is running on Render
2. Verify network connectivity
3. Check MongoDB connection
4. Review backend logs

## 📝 Environment Variables Summary

### Backend (.env on Render)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_strong_secret
PORT=5000
GEMINI_API_KEY=your_gemini_key
GENAI_MODEL=gemini-2.0-flash
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)
```
VITE_API_URL=https://smartnotes-backend-jt93.onrender.com/api
```

## 🎯 Next Steps

1. **Deploy Frontend**: Choose Vercel or Netlify
2. **Get Frontend URL**: Note the deployed URL
3. **Update Backend CORS**: Set CORS_ORIGIN to frontend URL
4. **Redeploy Backend**: Push changes to Render
5. **Test**: Verify everything works
6. **Monitor**: Keep an eye on logs and performance

## 📞 Support

For issues:
1. Check Render logs for backend errors
2. Check Vercel/Netlify logs for frontend errors
3. Verify environment variables are set correctly
4. Test API endpoints with curl or Postman
5. Check MongoDB Atlas for connection issues

---

**Your production setup is ready to deploy! 🚀**

