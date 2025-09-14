# ✅ Cloud Deployment Checklist

## 🚀 **Quick Start (5 minutes)**

### 1. **Prepare Code**
- [ ] Run `deploy-cloud.bat` to build everything
- [ ] Push code to GitHub repository
- [ ] Verify all files are committed

### 2. **Deploy Backend (Railway)**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Create new project from GitHub repo
- [ ] Add MySQL database service
- [ ] Deploy backend service
- [ ] Copy backend URL (e.g., `https://cinema-booking-backend.railway.app`)

### 3. **Deploy Frontend (Vercel)**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Import project from GitHub
- [ ] Set root directory to `frontendd`
- [ ] Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`
- [ ] Deploy
- [ ] Copy frontend URL (e.g., `https://cinema-booking-frontend.vercel.app`)

### 4. **Update Configuration**
- [ ] Update Railway CORS: `CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app`
- [ ] Update Vercel API URL: `VITE_API_URL=https://your-backend-url.railway.app`
- [ ] Redeploy both services

### 5. **Test Deployment**
- [ ] Open frontend URL
- [ ] Test cinema browsing
- [ ] Test seat selection
- [ ] Test booking flow
- [ ] Test admin panel

## 🔧 **Environment Variables**

### Railway (Backend)
```
DATABASE_URL=mysql://username:password@host:port/database
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
SPRING_PROFILES_ACTIVE=railway
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_WS_URL=wss://your-backend-url.railway.app
```

## 🧪 **Testing Checklist**

### Backend API Tests
- [ ] `GET /api/cinemas` - Returns cinema list
- [ ] `GET /api/cinemas/{id}/movies` - Returns movies
- [ ] `POST /api/bookings` - Creates booking
- [ ] `GET /api/bookings/user/{userId}` - Returns user bookings

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] Cinema list displays
- [ ] Movie selection works
- [ ] Seat selection is interactive
- [ ] Booking confirmation works
- [ ] Admin panel accessible

### Real-time Features
- [ ] WebSocket connection established
- [ ] Seat blocking works in real-time
- [ ] Multiple users can't book same seat

## 🚨 **Common Issues & Solutions**

### CORS Errors
- **Problem**: Frontend can't access backend API
- **Solution**: Update `CORS_ALLOWED_ORIGINS` in Railway

### Database Connection
- **Problem**: Backend can't connect to database
- **Solution**: Check `DATABASE_URL` format and credentials

### Build Failures
- **Problem**: Deployment fails during build
- **Solution**: Check build logs, verify dependencies

### WebSocket Issues
- **Problem**: Real-time features not working
- **Solution**: Use `wss://` for secure WebSocket connections

## 📊 **Post-Deployment**

### Monitoring
- [ ] Set up Railway monitoring
- [ ] Set up Vercel analytics
- [ ] Monitor error logs
- [ ] Check performance metrics

### Security
- [ ] Verify HTTPS is enabled
- [ ] Check CORS configuration
- [ ] Review environment variables
- [ ] Set up database backups

### Maintenance
- [ ] Set up automated deployments
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring alerts
- [ ] Plan for scaling

## 🎯 **Success Criteria**

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Backend API responds correctly
- ✅ Database operations work
- ✅ Real-time seat booking functions
- ✅ Admin panel is accessible
- ✅ All user flows work end-to-end

## 📞 **Need Help?**

1. **Check logs**: Railway and Vercel dashboards
2. **Review guide**: `CLOUD-DEPLOYMENT.md`
3. **Test locally**: Use `quick-deploy.bat` first
4. **Community**: Railway and Vercel Discord

---

**🎉 Ready to deploy?** Run `deploy-cloud.bat` and follow this checklist!

