# 🚀 Cinema Booking System - Deployment Guide

This guide covers multiple deployment options for the Cinema Booking System, from local development to cloud production.

## 📋 Prerequisites

- **Docker & Docker Compose** (for containerized deployment)
- **Node.js 18+** and **npm** (for frontend)
- **Java 17+** and **Maven 3.6+** (for backend)
- **MySQL 8.0+** (for database)

## 🏠 Local Deployment (Recommended for Development)

### Option 1: Docker Compose (Easiest)

1. **Clone and navigate to project:**
   ```bash
   git clone <repository-url>
   cd cinema-booking-system
   ```

2. **Start all services:**
   ```bash
   # Windows
   deploy-local.bat
   
   # Linux/Mac
   chmod +x deploy-local.sh
   ./deploy-local.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - WebSocket: ws://localhost:8080/ws

### Option 2: Manual Setup

1. **Start MySQL:**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE cinema_booking;
   ```

2. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Start Frontend:**
   ```bash
   cd frontendd
   npm install
   npm run dev
   ```

## ☁️ Cloud Deployment

### Railway (Recommended for Backend)

1. **Prepare for Railway:**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. **Deploy to Railway:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect the `railway.json` configuration
   - Set environment variables:
     - `DATABASE_URL`: Your MySQL connection string
     - `MYSQL_USER`: Database username
     - `MYSQL_PASSWORD`: Database password
     - `CORS_ALLOWED_ORIGINS`: Your frontend URL

3. **Database Setup:**
   - Add MySQL service in Railway
   - Update `DATABASE_URL` with Railway's MySQL connection string

### Vercel (Frontend)

1. **Build frontend:**
   ```bash
   cd frontendd
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable:
     - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

3. **Update API configuration:**
   - Update `vite.config.js` to use environment variables for API URL

### Heroku (Alternative Backend)

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create cinema-booking-backend
   ```

3. **Add MySQL addon:**
   ```bash
   heroku addons:create cleardb:ignite
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `jdbc:mysql://localhost:3306/cinema_booking` |
| `DATABASE_USERNAME` | Database username | `root` |
| `DATABASE_PASSWORD` | Database password | `jassi` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:3000,http://localhost:5173` |
| `PORT` | Server port | `8080` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:8080` |

## 🐳 Docker Commands

### Build and Run Individual Services

```bash
# Build backend
docker build -t cinema-backend ./backend

# Build frontend
docker build -t cinema-frontend ./frontendd

# Run with custom network
docker network create cinema-network
docker run -d --name cinema-mysql --network cinema-network -e MYSQL_ROOT_PASSWORD=jassi -e MYSQL_DATABASE=cinema_booking mysql:8.0
docker run -d --name cinema-backend --network cinema-network -p 8080:8080 cinema-backend
docker run -d --name cinema-frontend --network cinema-network -p 3000:80 cinema-frontend
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Remove volumes (clean database)
docker-compose down -v
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change ports in `docker-compose.yml` if 3000, 8080, or 3306 are in use

2. **Database connection issues:**
   - Ensure MySQL is running and accessible
   - Check connection string format
   - Verify credentials

3. **CORS errors:**
   - Update `CORS_ALLOWED_ORIGINS` in backend configuration
   - Ensure frontend URL is included

4. **WebSocket connection issues:**
   - Check WebSocket URL configuration
   - Ensure proxy settings are correct

### Health Checks

```bash
# Check backend health
curl http://localhost:8080/api/cinemas

# Check frontend
curl http://localhost:3000

# Check database
mysql -h localhost -u root -p -e "SHOW DATABASES;"
```

## 📊 Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Performance Monitoring

- Backend: Spring Boot Actuator endpoints (if enabled)
- Frontend: Browser DevTools Network tab
- Database: MySQL performance schema

## 🔒 Security Considerations

### Production Checklist

- [ ] Change default database passwords
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor application logs
- [ ] Use connection pooling
- [ ] Implement rate limiting

### Environment Variables Security

- Never commit `.env` files
- Use secret management services
- Rotate credentials regularly
- Use least privilege principle

## 🚀 Quick Deploy Commands

### Local Development
```bash
# Start everything
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Production Deployment
```bash
# Backend (Railway)
railway login
railway link
railway up

# Frontend (Vercel)
vercel --prod
```

## 📞 Support

If you encounter issues during deployment:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity
5. Review the troubleshooting section above

---

**Note**: This deployment guide covers the most common scenarios. For specific cloud providers or custom setups, refer to their respective documentation.

