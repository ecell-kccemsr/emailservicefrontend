# Deployment Guide - E-Cell Email Service

This guide provides step-by-step instructions for deploying the E-Cell Email Service to production.

## 🚀 Deployment Overview

- **Frontend**: Netlify (Static hosting + Functions)
- **Backend**: Railway or Render (Container hosting)
- **Database**: MongoDB Atlas (Cloud database)
- **Images**: Cloudinary (CDN)
- **Email**: Gmail API

## 📋 Prerequisites

1. **GitHub Repository**: Code pushed to GitHub
2. **MongoDB Atlas Account**: [Sign up here](https://www.mongodb.com/atlas)
3. **Netlify Account**: [Sign up here](https://www.netlify.com/)
4. **Railway Account**: [Sign up here](https://railway.app/) OR Render Account
5. **Cloudinary Account**: [Sign up here](https://cloudinary.com/)
6. **Google Cloud Console**: For Gmail API setup

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Create a New Cluster"
3. Choose your cloud provider and region
4. Select cluster tier (M0 Sandbox for free tier)
5. Name your cluster (e.g., "ecell-email-service")
6. Click "Create Cluster"

### 2. Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password
4. Set permissions to "Read and write to any database"
5. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (Allow access from anywhere) for development
4. For production, add specific IPs of your deployment services

### 4. Get Connection String

1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `ecell-email-service`)

## 📧 Gmail API Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API" and enable it

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure consent screen if prompted
4. Choose "Web application"
5. Add authorized redirect URIs:
   - `https://developers.google.com/oauthplayground`
6. Save and note down Client ID and Client Secret

### 3. Generate Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click gear icon → check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1, enter: `https://www.googleapis.com/auth/gmail.send`
5. Click "Authorize APIs"
6. In Step 2, click "Exchange authorization code for tokens"
7. Copy the refresh token

## ☁️ Backend Deployment (Railway)

### 1. Connect Repository

1. Sign in to [Railway](https://railway.app/)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Choose the backend folder or configure build path

### 2. Configure Environment Variables

Add these environment variables in Railway dashboard:

```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_USER=your-email@gmail.com
FROM_NAME=E-Cell KCCOE
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-netlify-domain.netlify.app
```

### 3. Deploy

1. Railway will automatically deploy when you push to your repository
2. Note down your deployment URL (e.g., `https://your-app.railway.app`)

## 🌐 Frontend Deployment (Netlify)

### 1. Connect Repository

1. Sign in to [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`

### 2. Configure Environment Variables

Add these environment variables in Netlify dashboard:

```env
REACT_APP_API_URL=https://your-railway-app.railway.app/api
REACT_APP_APP_NAME=E-Cell Email Service
```

### 3. Configure Redirects

Netlify will automatically use the `netlify.toml` file in your repository root for redirects.

### 4. Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your frontend
3. Note down your site URL (e.g., `https://amazing-site-name.netlify.app`)

## 🖼️ Cloudinary Setup

1. Sign up for [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add these to your backend environment variables

## 🔗 Domain Configuration (Optional)

### Custom Domain for Frontend

1. In Netlify, go to "Domain management"
2. Add your custom domain
3. Configure DNS records as instructed

### Custom Domain for Backend

1. In Railway, go to your project settings
2. Add custom domain
3. Configure DNS records

## 🧪 Testing Deployment

### 1. Test API Endpoints

```bash
curl https://your-backend-domain.com/api/health
```

### 2. Test Frontend

Visit your frontend URL and try to log in with seeded admin credentials.

### 3. Test Email Functionality

1. Log in to admin dashboard
2. Try sending a test email
3. Check Gmail API quota in Google Cloud Console

## 📊 Monitoring & Maintenance

### 1. Monitor Logs

- **Railway**: Check application logs in Railway dashboard
- **Netlify**: Check function logs and build logs
- **MongoDB**: Monitor database performance in Atlas

### 2. Set Up Alerts

- MongoDB Atlas: Set up alerts for connection issues
- Railway: Monitor CPU and memory usage
- Gmail API: Monitor quota usage in Google Cloud Console

### 3. Database Backups

MongoDB Atlas automatically creates backups, but consider:

- Setting up additional backup schedules
- Testing restore procedures

## 🔒 Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS for all communications
- [ ] Regularly rotate JWT secrets
- [ ] Monitor for unusual API usage
- [ ] Keep dependencies updated
- [ ] Use strong passwords for database users
- [ ] Enable 2FA on all service accounts

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check FRONTEND_URL environment variable
   - Verify CORS configuration in backend

2. **Database Connection Issues**

   - Verify MongoDB connection string
   - Check network access settings in Atlas

3. **Gmail API Errors**

   - Verify OAuth credentials
   - Check API quotas in Google Cloud Console
   - Ensure refresh token is valid

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Check build logs for specific errors

### Support

For deployment issues:

- Check service status pages
- Contact support through respective platforms
- Review documentation and community forums

## 📋 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection working
- [ ] Gmail API working
- [ ] Frontend accessible
- [ ] Admin login working
- [ ] Test email sending
- [ ] Cloudinary image upload working
- [ ] All redirects working properly
- [ ] SSL certificates active
- [ ] Monitoring configured

---

**Congratulations! 🎉 Your E-Cell Email Service is now live!**
