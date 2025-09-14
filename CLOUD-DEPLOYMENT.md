# ☁️ Cloud Deployment Guide

This guide will help you deploy your Cinema Booking System to the cloud using Railway (backend) and Vercel (frontend).

## 🚀 **Step 1: Deploy Backend to Railway**

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub repository

### 1.2 Deploy Backend
1. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add MySQL Database**:
   - Click "New" → "Database" → "MySQL"
   - Railway will create a MySQL database
   - Note the connection details

3. **Deploy Backend**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Railway will detect the `railway.json` configuration
   - Set the root directory to `backend`

4. **Configure Environment Variables**:
   ```
   DATABASE_URL=mysql://username:password@host:port/database
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   SPRING_PROFILES_ACTIVE=railway
   ```

5. **Deploy**:
   - Railway will automatically build and deploy
   - Note the backend URL (e.g., `https://cinema-booking-backend.railway.app`)

## 🌐 **Step 2: Deploy Frontend to Vercel**

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub repository

### 2.2 Deploy Frontend
1. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontendd`

2. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_WS_URL=wss://your-backend-url.railway.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note the frontend URL (e.g., `https://cinema-booking-frontend.vercel.app`)

## 🔧 **Step 3: Update Configuration**

### 3.1 Update Backend CORS
1. Go to Railway dashboard
2. Select your backend service
3. Go to "Variables" tab
4. Update `CORS_ALLOWED_ORIGINS` with your Vercel URL:
   ```
   CORS_ALLOWED_ORIGINS=https://cinema-booking-frontend.vercel.app
   ```

### 3.2 Update Frontend API URL
1. Go to Vercel dashboard
2. Select your frontend project
3. Go to "Settings" → "Environment Variables"
4. Update `VITE_API_URL` with your Railway URL:
   ```
   VITE_API_URL=https://cinema-booking-backend.railway.app
   ```

## 🧪 **Step 4: Test Deployment**

### 4.1 Test Backend
```bash
# Test API endpoints
curl https://your-backend-url.railway.app/api/cinemas
curl https://your-backend-url.railway.app/api/movies
```

### 4.2 Test Frontend
1. Open your Vercel URL
2. Test all features:
   - Browse cinemas
   - Select movies
   - Book seats
   - Check admin panel

## 📊 **Step 5: Monitor and Maintain**

### 5.1 Railway Monitoring
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### 5.2 Vercel Monitoring
- Check deployment status
- View build logs
- Monitor performance

## 🔒 **Security Considerations**

### Production Checklist
- [ ] Use strong database passwords
- [ ] Enable HTTPS (automatic with Railway/Vercel)
- [ ] Set up proper CORS origins
- [ ] Monitor application logs
- [ ] Set up database backups
- [ ] Use environment variables for secrets

## 🚨 **Troubleshooting**

### Common Issues

1. **CORS Errors**:
   - Update `CORS_ALLOWED_ORIGINS` in Railway
   - Ensure frontend URL is correct

2. **Database Connection Issues**:
   - Check `DATABASE_URL` format
   - Verify MySQL credentials
   - Ensure database is accessible

3. **Build Failures**:
   - Check build logs in Railway/Vercel
   - Verify all dependencies are installed
   - Check for syntax errors

4. **WebSocket Issues**:
   - Ensure WebSocket URL uses `wss://` (secure)
   - Check Railway WebSocket support

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test API locally
curl -X GET https://your-backend-url.railway.app/api/cinemas
```

## 📈 **Scaling Considerations**

### Backend Scaling
- Railway automatically scales based on traffic
- Consider upgrading to higher tier for production
- Monitor database performance

### Frontend Scaling
- Vercel CDN handles global distribution
- Consider custom domain for production
- Monitor Core Web Vitals

## 🎯 **Next Steps After Deployment**

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up automated backups**
4. **Implement CI/CD pipeline**
5. **Add payment integration** (if needed)
6. **Set up analytics tracking**

## 📞 **Support Resources**

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: Check GitHub repository issues
- **Community**: Railway and Vercel Discord communities

---

**🎉 Congratulations!** Your Cinema Booking System is now live in the cloud!

