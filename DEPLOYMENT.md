# 🚀 Deployment Guide

This guide covers deploying the Microschool Platform to GitHub and Netlify.

## 📋 Quick Deploy Checklist

### 1. Deploy to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Microschool Platform prototype"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/microschool-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy Frontend to Netlify

#### Option A: GitHub Integration (Recommended)
1. **Connect to GitHub:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your `microschool-platform` repository

2. **Build Settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-api.herokuapp.com/api
   ```

#### Option B: Manual Deploy
```bash
# Build the React app
cd client
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build
```

### 3. Deploy Backend API

#### Option A: Heroku (Recommended)
```bash
# Install Heroku CLI first, then:
cd server

# Login to Heroku
heroku login

# Create app
heroku create your-microschool-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Deploy
git init
git add .
git commit -m "Deploy backend API"
heroku git:remote -a your-microschool-api
git push heroku main
```

#### Option B: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option C: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd server
vercel --prod
```

## 🌐 Live Demo URLs

Once deployed, your platform will be available at:

- **Frontend:** `https://your-microschool-platform.netlify.app`
- **Backend API:** `https://your-microschool-api.herokuapp.com`

## 🔧 Environment Configuration

### Frontend (.env in client folder)
```env
REACT_APP_API_URL=https://your-backend-api.herokuapp.com/api
GENERATE_SOURCEMAP=false
```

### Backend (.env in server folder)
```env
NODE_ENV=production
PORT=5000

# Optional: Add real database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/microschool

# Optional: Add real integrations
STRIPE_SECRET_KEY=sk_live_your_stripe_key
PLAID_SECRET=your_plaid_secret
OPENAI_API_KEY=your_openai_key
```

## 📝 Post-Deployment Steps

1. **Update API URL:** Change the frontend to point to your deployed backend
2. **Test All Features:** Verify all components work with the deployed API
3. **Add Custom Domain:** Configure your own domain in Netlify
4. **SSL Certificate:** Netlify provides free SSL automatically
5. **Monitor Performance:** Use Netlify Analytics

## 🔒 Security Considerations

For production deployment:

1. **Add Real Authentication:** Replace mock auth with JWT/OAuth
2. **Environment Variables:** Never commit API keys to GitHub
3. **CORS Configuration:** Restrict to your domain only
4. **Rate Limiting:** Add API rate limiting for production
5. **Database:** Replace mock data with MongoDB/PostgreSQL

## 🚀 One-Click Deploy Buttons

Add these to your README for easy deployment:

### Deploy Frontend to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/microschool-platform)

### Deploy Backend to Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/microschool-platform)

## 📊 Performance Optimization

Before deploying to production:

```bash
# Optimize build size
cd client
npm run build
npm install -g serve
serve -s build

# Check bundle size
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🐛 Troubleshooting

Common deployment issues:

1. **Build Errors:** Check Node.js version compatibility
2. **API Connection:** Verify CORS and environment variables
3. **Missing Dependencies:** Ensure all packages in package.json
4. **Memory Issues:** Use Node.js 18+ for better performance

## 📈 Monitoring & Analytics

Post-deployment monitoring:

- **Frontend:** Netlify Analytics (built-in)
- **Backend:** Heroku metrics or external monitoring
- **Uptime:** UptimeRobot or Pingdom
- **Error Tracking:** Sentry integration recommended

---

**Your microschool platform will be live and accessible to operators worldwide!** 🌎
