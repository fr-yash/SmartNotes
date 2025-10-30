# 🚀 Quick Deployment Reference

## Vercel + Render (Recommended)

### Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Environment variables: (none needed - uses `/api`)
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```
6. Deploy

### Vercel Rewrite (vercel.json)
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

---

## Netlify + Heroku

### Frontend (Netlify)
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

### Backend (Heroku)
```bash
heroku create smartnotes-api
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set CORS_ORIGIN=https://your-netlify-app.netlify.app
git push heroku main
```

### Netlify Redirect (_redirects)
```
/api/* https://your-heroku-app.herokuapp.com/api/:splat 200
```

---

## Railway (All-in-One)

### Setup
1. Connect GitHub repo
2. Create two services: frontend and backend
3. Set environment variables for backend
4. Railway auto-detects and deploys

### Backend Environment
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CORS_ORIGIN=https://your-railway-frontend.up.railway.app
```

---

## Docker + Any Cloud

### Dockerfile (Backend)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: ${MONGO_URI}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## Environment Variables Checklist

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_strong_secret_key_here
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GENAI_MODEL=gemini-2.0-flash
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.production)
```
VITE_API_URL=/api
```

---

## Troubleshooting

### Admin Dashboard 404 Errors
1. Check CORS_ORIGIN matches frontend domain
2. Verify backend is running
3. Check API endpoints: `curl https://your-backend/api/admin/analytics`

### CORS Errors
1. Update CORS_ORIGIN in backend .env
2. Restart backend
3. Clear browser cache

### API Not Found
1. Verify API_BASE_URL in frontend
2. Check reverse proxy configuration
3. Test with Postman

---

## Performance Tips

1. **Enable Caching**: Set cache headers on frontend
2. **Use CDN**: Serve frontend through CDN
3. **Database Indexing**: Add indexes to MongoDB
4. **Rate Limiting**: Implement on backend
5. **Compression**: Enable gzip on backend

---

## Monitoring

### Backend Logs
- Render: Dashboard → Logs
- Heroku: `heroku logs --tail`
- Railway: Dashboard → Logs

### Frontend Errors
- Vercel: Analytics → Web Vitals
- Netlify: Analytics → Functions

### Database
- MongoDB Atlas: Monitoring tab
- Check connection limits
- Monitor query performance

---

## Cost Estimates (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Generous free tier |
| Render | $7+ | Free tier available |
| Heroku | $7+ | Paid only |
| Railway | $5+ | Pay-as-you-go |
| MongoDB Atlas | Free | 512MB free tier |
| **Total** | **$12-20** | Minimal cost |

---

## Quick Commands

```bash
# Build frontend
cd frontend && npm run build

# Test production build locally
npm run preview

# Start backend
cd backend && npm start

# Check backend health
curl http://localhost:5000

# Test API
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Choose your platform and deploy! 🚀**

